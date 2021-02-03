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
 * @param {Number} [maxLineLength] The length to stop reading at if no line break has been reached
 * @return {Object} The generator object
 */
function* readlines(fd, filesize, bufferSize, position, maxLineLength) {
  if (typeof bufferSize === 'undefined') bufferSize = 64 * 1024;
  if (typeof position === 'undefined') position = 0;
  if (!(maxLineLength > 0)) maxLineLength = Infinity;

  const originalMaxLineLength = maxLineLength;
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
      curbyte = readChunk[curpos++];
      // break after CR or LF, or after the maximum length, otherwise go on
      if (curbyte !== LF && curbyte !== CR && curpos - startpos <= maxLineLength) {
        lastWasCR = false;
        continue;
      }

      // skip this LF if the last chunk ended with a CR
      if (curbyte === LF && lastWasCR) {
        startpos = curpos;
        lastWasCR = false;
        continue;
      }

      // yield the buffer from the last line break to the current position
      const wantedLength = yield _concat(lineBuffer, readChunk.slice(startpos, curpos - 1));
      // change the maximum length to the latest parameter of next()
      maxLineLength = wantedLength > 0 ? wantedLength : originalMaxLineLength;

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
 * @param {Number} [bufferSize] The size of the buffer in bytes
 * @param {Number} [maxLineLength] The length to stop reading at if no line break has been reached
 * @return {Object} The generator object
 */
function* fromFile(filename, bufferSize, maxLineLength) {
  const fd = fs.openSync(filename, 'r');
  const fileSize = fs.statSync(filename).size;

  yield* readlines(fd, fileSize, bufferSize, undefined, maxLineLength);

  fs.closeSync(fd);
}

module.exports = readlines;

module.exports.fromFile = fromFile;
