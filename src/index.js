'use strict';

import fs from 'fs';

import polyfill from 'babel/polyfill';

var newlineChars = [
  13,
  10
];

function readlines(fd, filesize, bufferSize=1024, position=0) {
  return _readlines(fd, filesize, bufferSize, position);
}

var _readlines = function* (fd, filesize, bufferSize, position) {
  let lineBuffer;
  while (position < filesize) {
    let remaining = filesize - position;
    if (remaining < bufferSize) bufferSize = remaining;

    let readChunk = new Buffer(bufferSize);
    try {
      fs.readSync(fd, readChunk, 0, bufferSize, position);
    } catch (err) {
      throw err;
    }

    let foundNewline = _foundNewline(readChunk);
    if (foundNewline > 0) {
      let newlineBuffer = new Buffer(readChunk.slice(0, foundNewline));
      yield _concat(lineBuffer, newlineBuffer);

      position += newlineBuffer.length;
      lineBuffer = undefined;
    } else if (foundNewline == -1) {
      position += bufferSize;
      lineBuffer = _concat(lineBuffer, readChunk);
    } else if (foundNewline == 0) {
      position += 1;
    }
  }
  // dump what ever is left in the buffer
  if (Buffer.isBuffer(lineBuffer)) yield lineBuffer;
};

function _foundNewline(readChunk) {
  for (let i = 0; i < readChunk.length; i++)
    if (newlineChars.indexOf(readChunk[i]) >= 0) return i;
  return -1;
}

function _concat(buffOne, buffTwo) {
  if (!buffOne) return buffTwo;
  if (!buffTwo) return buffOne;

  let newLength = buffOne.length + buffTwo.length;
  return Buffer.concat([buffOne, buffTwo], newLength);
}

module.exports = readlines;