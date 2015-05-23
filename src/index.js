'use strict';

import fs from 'fs';
import path from 'path';
import polyfill from 'babel/polyfill';

export default class Readlines {
  constructor(fd, fileSize, bufferSize=80) {
    this.bufferSize = bufferSize;
    if (fd) {
      this.fd = fd;
      if (fileSize) {
        this._size = fileSize;
        this.rewind();
      }
    }
  }

  async stat(fname) {
    this.fname = fname;
    try {
      this.stats = await fsStat(fname);
      this._size = this.stats.size;
      return Promise.resolve(this.stats);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async open(fname) {
    this.fname = fname;
    try {
      await this.stat(fname);
    } catch (err) {
      return Promise.reject(err);
    }

    try {
      this.fd = await fsOpen(fname);
      this.rewind();
      return Promise.resolve(this);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async close() {
    if (!this.is_open) return Promise.resolve(this);
    let fclose;
    try {
      fclose = await fsClose(this.fd);
      this.fd = undefined;
      return Promise.resolve(this);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  get is_open() {
    return Boolean(this.fd);
  }

  rewind() {
    if (!this._size) throw new Error('Filesize not found, supply in constructor or call ".stat()" for a promise');
    this._position = 0;
    this._remaining = this._size;
    return this;
  }

  * lines() {
    if (!this.fd || !this._size) throw new Error('File descriptor and filesize required to get lines');

    while (this._remaining > 0) {
      this._remaining = this._size - this._position;
      if (this._remaining <= 0) break;

      let tmpBufferSize = this.bufferSize;
      if (this._remaining < this.bufferSize) tmpBufferSize = this._remaining;

      let chunk = new Buffer(tmpBufferSize);
      try {
        fs.readSync(this.fd, chunk, 0, tmpBufferSize, this._position);
      } catch (err) {
        throw new Error(err);
      }

      let data = chunk.toString();

      let found_newline = findLine(data);
      if (found_newline === -1) {
        this._lineBuffer = concat(this._lineBuffer, chunk);
        this._position += tmpBufferSize;
        yield* this.lines();
        return;
      } else if (found_newline === 0) {
        this._position += 1;
        yield* this.lines();
        return;
      }

      let newlineBuffer = new Buffer(data.substring(0, found_newline));
      this._position += newlineBuffer.length;
      yield concat(this._lineBuffer, newlineBuffer);
      this._lineBuffer = undefined;
    }
    this.rewind();
  }
}

function fsStat(fname) {
  return new Promise(function(resolve, reject) {
    fs.stat(fname, function(err, stats) {
      if (err) return reject(err);
      resolve(stats);
    });
  });
}

function fsOpen(fname) {
  return new Promise(function(resolve, reject) {
    fs.open(fname, 'r', function(err, fd) {
      if (err) return reject(err);
      resolve(fd);
    });
  });
}

function fsClose(fd) {
  return new Promise(function(resolve, reject) {
    fs.close(fd, function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function concat(buff_one, buff_two) {
  if (!buff_one) return buff_two;
  if (!buff_two) return buff_one;
  let new_length = buff_one.length + buff_two.length;

  return Buffer.concat([buff_one, buff_two], new_length);
}

function findLine(chunk) {
  return chunk.search(/\r\n|\r|\n/);
}