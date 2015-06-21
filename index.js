'use strict';

var fs = require('fs');

var newlineChars = [
  13,
  10
];

/**
 * Generator based line reader
 *
 * @param {Number} [fd] The file descriptor
 * @param {Number} [filesize] The size of the file in bytes
 * @param {Number} [bufferSize] The size of the buffer in bytes
 * @param {Number} [position] The position where to start reading the file in bytes
 * @return {Object} The generator object
 */
function* readlines(fd, filesize, bufferSize, position) {
  if (typeof bufferSize === 'undefined') bufferSize = 1024;
  if (typeof position === 'undefined') position = 0;

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

/**
 * Determines if a new line character is in the buffer object
 *
 * @param {Object} [readChunk] Buffer object
 * @return {Number} The position of the new line character
 */
function _foundNewline(readChunk) {
  for (let i = 0; i < readChunk.length; i++)
    if (newlineChars.indexOf(readChunk[i]) >= 0) return i;
  return -1;
}

/**
 * Combines two buffers
 *
 * @param {Object} [buffOne] First buffer object
 * @param {Object} [buffTwo] Second buffer object
 * @return {Object} Combined buffer object
 */
function _concat(buffOne, buffTwo) {
  if (!buffOne) return buffTwo;
  if (!buffTwo) return buffOne;

  let newLength = buffOne.length + buffTwo.length;
  return Buffer.concat([buffOne, buffTwo], newLength);
}

module.exports = readlines;