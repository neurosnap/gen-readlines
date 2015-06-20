'use strict';

import fs from 'fs';

import polyfill from 'babel/polyfill';

var newline_chars = [
  13,
  10
];

var readlines = function* (fd, filesize, bufferSize=1024, position=0) {
  yield* _readlines(fd, filesize, bufferSize, position);
};

var _readlines = function* (fd, filesize, bufferSize, position) {
  let lineBuffer;
  while (position < filesize) {
    let remaining = filesize - position;
    if (remaining < bufferSize) bufferSize = remaining;

    let read_chunk = new Buffer(bufferSize);
    try {
      fs.readSync(fd, read_chunk, 0, bufferSize, position);
    } catch (err) {
      throw err;
    }

    let found_newline = _foundNewline(read_chunk);
    if (found_newline == -1) {
      lineBuffer = _concat(lineBuffer, read_chunk);
      position += bufferSize;
    } else if (found_newline == 0) {
      position += 1;
    } else {
      let newlineBuffer = new Buffer(read_chunk.slice(0, found_newline));
      yield _concat(lineBuffer, newlineBuffer);
      position += newlineBuffer.length;
      lineBuffer = undefined;
    }
  }
  // dump what ever is left in the buffer
  if (Buffer.isBuffer(lineBuffer)) yield lineBuffer;
};

function _foundNewline(read_chunk) {
  for (let i = 0; i < read_chunk.length; i++) {
    if (newline_chars.indexOf(read_chunk[i]) >= 0) {
      return i;
    }
  }
  return -1;
}

function _concat(buff_one, buff_two) {
  if (!buff_one) return buff_two;
  if (!buff_two) return buff_one;

  let new_length = buff_one.length + buff_two.length;
  return Buffer.concat([buff_one, buff_two], new_length);
}

module.exports = readlines;