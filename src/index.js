'use strict';

import fs from 'fs';
import path from 'path';
import polyfill from 'babel/polyfill';

export default class Readlines {
  constructor(identifier, fileSize, bufferSize=80) {
    this.bufferSize = bufferSize;
    this._position = 0;

    if (typeof identifier === 'string') {
      this.fname = identifier;
      return this.open();
    }

    this._fd = identifier;
    this._size = fileSize;
    this._remaining = this._size - this._position;
  }

  async open() {
    try {
      this._stats = await fsStat(this.fname);
    } catch (err) {
      return Promise.reject(err);
    }

    this._size = this._stats.size;
    this._remaining = this._size - this._position;

    try {
      this._fd = await fsOpen(this.fname);
      return Promise.resolve(this);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  * lines() {
    while (this._remaining > 0) {
      this._remaining = this._size - this._position;
      if (this._remaining <= 0) break;

      let tmpBufferSize = this.bufferSize;
      if (this._remaining < this.bufferSize) tmpBufferSize = this._remaining;

      let chunk = new Buffer(tmpBufferSize);
      try {
        fs.readSync(this._fd, chunk, 0, tmpBufferSize, this._position);
      } catch (err) {
        throw err;
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
    this._position = 0;
    this._remaining = this._size;
    return this.close();
  }

  close() {
    return fsClose(this._fd);
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