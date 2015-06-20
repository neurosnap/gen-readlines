'use strict';

import fs from 'fs';

import polyfill from 'babel/polyfill';

var newline_chars = [
  13,
  10
];

var readlines = function* (fd, filesize, bufferSize=1024) {
  yield* _readlines(fd, filesize, bufferSize, 0);
};

var _readlines = function* (fd, filesize, bufferSize, position, lineBuffer) {
  while (position < filesize) {
    let remaining = filesize - position;
    if (remaining < bufferSize) bufferSize = remaining;

    let chunk = new Buffer(bufferSize);
    try {
      fs.readSync(fd, chunk, 0, bufferSize, position);
    } catch (err) {
      throw new Error(err);
    }

    let found_newline = _foundNewline(chunk);
    if (found_newline == -1) {
      lineBuffer = _concat(lineBuffer, chunk);
      position += bufferSize;
    } else if (found_newline == 0) {
      position += 1;
    } else {
      let newlineBuffer = new Buffer(chunk.slice(0, found_newline));
      yield _concat(lineBuffer, newlineBuffer);
      position += newlineBuffer.length;
      lineBuffer = undefined;
    }
  }
  if (Buffer.isBuffer(lineBuffer)) yield lineBuffer;
};

function _foundNewline(chunk) {
  for (let i = 0; i < chunk.length; i++) {
    if (newline_chars.indexOf(chunk[i]) >= 0) {
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