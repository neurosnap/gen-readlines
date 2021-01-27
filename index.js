'use strict';

const fs = require('fs');

const LF = 10;
const CR = 13;

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
  if (typeof bufferSize === 'undefined') bufferSize = 64 * 1024;
  if (typeof position === 'undefined') position = 0;

  let lineBuffer;
  let lastWasCR;

  while (position < filesize) {
    let remaining = filesize - position;
    if (remaining < bufferSize) bufferSize = remaining;

    let readChunk = Buffer.alloc(bufferSize);
    let bytesRead = fs.readSync(fd, readChunk, 0, bufferSize, position);

    let curpos = 0;
    let startpos = 0;
    let curbyte;
    while (curpos < bytesRead) {
      curbyte = readChunk[curpos];
      // break after CR or LF, otherwise go on
      if (curbyte !== LF && curbyte !== CR) {
        ++curpos;
        lastWasCR = false;
        continue;
      }

      // skip this LF if last chunk ended with a CR
      if (curbyte === LF && lastWasCR) {
        startpos = ++curpos;
        lastWasCR = false;
        continue;
      }

      // yield the buffer from the last line break to the current position
      yield _concat(lineBuffer, readChunk.slice(startpos, curpos));

      ++curpos;
      // skip one more character if a LF follows a CR, otherwise remember
      // that the CR was standing alone
      if (curbyte === CR) {
        if (readChunk[curpos] === LF) {
          ++curpos;
          lastWasCR = false;
        } else {
          lastWasCR = true;
        }
      } else {
        lastWasCR = false;
      }

      // invalidate the yielded buffer and move after the line break
      lineBuffer = undefined;
      startpos = curpos;
    }

    position += bytesRead;

    if (startpos < bytesRead) {
      lineBuffer = _concat(lineBuffer, readChunk.slice(startpos, bytesRead));
    }
  }
  // dump what ever is left in the buffer
  if (Buffer.isBuffer(lineBuffer)) yield lineBuffer;
};

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

/**
 * Generator based line reader with simplified API
 *
 * @param {string} [filename] Name of input file
 * @return {Object} The generator object
 */
function* fromFile(filename) {
  const fd = fs.openSync(filename, 'r');
  const fileSize = fs.statSync(filename).size;

  yield* readlines(fd, fileSize);

  fs.closeSync(fd);
}

module.exports = readlines;

module.exports.fromFile = fromFile;
