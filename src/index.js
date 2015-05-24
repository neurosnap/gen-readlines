'use strict';

import fs from 'fs';
import polyfill from 'babel/polyfill';
import { StringDecoder } from 'string_decoder';

var readlines = function* (fd, filesize, encoding='utf8', bufferSize=80) {
  let decoder = new StringDecoder(encoding);
  yield* _readlines(fd, filesize, bufferSize, decoder, 0);
};

var _readlines = function* (fd, filesize, bufferSize, decoder, position, lineBuffer) {
  while (position < filesize) {
    let remaining = filesize - position;
    let tmpBufferSize = bufferSize;
    if (remaining < bufferSize) tmpBufferSize = remaining;

    let chunk = new Buffer(tmpBufferSize);
    try {
      fs.readSync(fd, chunk, 0, tmpBufferSize, position);
    } catch (err) {
      throw new Error(err);
    }

    let found_newline = newlineFound(chunk);
    if (found_newline === -1) {
      lineBuffer = concat(lineBuffer, chunk);
      position += tmpBufferSize;
      yield* _readlines(fd, filesize, bufferSize, decoder, position, lineBuffer);
      return;
    } else if (found_newline === 0) {
      position += 1;
      yield* _readlines(fd, filesize, bufferSize, decoder, position, lineBuffer);
      return;
    }

    let newlineBuffer = new Buffer(chunk.slice(0, found_newline));
    position += newlineBuffer.length;
    yield concat(lineBuffer, newlineBuffer);
    lineBuffer = undefined;
  }
};

function concat(buff_one, buff_two) {
  if (!buff_one) return buff_two;
  if (!buff_two) return buff_one;
  let new_length = buff_one.length + buff_two.length;

  return Buffer.concat([buff_one, buff_two], new_length);
}

function newlineFound(chunk) {
  for (let i = 0; i < chunk.length; i++) {
    if (chunk[i] == 13 || chunk[i] == 10) {
      console.log('FOUND');
      return i;
    }
  }
  return -1;
}

module.exports = readlines;