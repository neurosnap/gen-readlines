'use strict';
import polyfill from 'babel/polyfill';
import fs from 'fs';

var readlines = function* (fd, filesize, bufferSize) {
  if (typeof bufferSize === 'undefined') bufferSize = 80;
  yield* _readlines(fd, filesize, bufferSize, 0);
};

var _readlines = function* (fd, filesize, bufferSize, position, lineBuffer) {
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

    let data = chunk.toString();
    let found_newline = findLine(data);
    if (found_newline === -1) {
      lineBuffer = concat(lineBuffer, chunk);
      position += tmpBufferSize;
      yield* _readlines(fd, filesize, bufferSize, position, lineBuffer);
      return;
    } else if (found_newline === 0) {
      position += 1;
      yield* _readlines(fd, filesize, bufferSize, position, lineBuffer);
      return;
    }

    let newlineBuffer = new Buffer(data.substring(0, found_newline));
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

function findLine(chunk) {
  return chunk.search(/\r\n|\r|\n/);
}

module.exports = readlines;