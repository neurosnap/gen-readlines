'use strict';

var fs = require('fs');

var LF = 10;
var CR = 13;

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

  let readChunk = new Buffer(bufferSize);
  let lineBuffer;
  while (position < filesize) {
    let remaining = filesize - position;
    if (remaining < bufferSize) bufferSize = remaining;

    let bytesRead = fs.readSync(fd, readChunk, 0, bufferSize, position);

    let curpos = 0, startpos = 0;
    let seenCR = false;
    let atend, curbyte;
    while (curpos < bytesRead) {
      curbyte = readChunk[curpos];
      atend = curpos >= bytesRead - 1;
      // skip LF if seenCR before or yield
      if (curbyte == LF && !seenCR || curbyte == CR && !atend) {
        yield _concat(lineBuffer, readChunk.slice(startpos, curpos));
        lineBuffer = undefined;
        startpos = curpos + 1;
        if (curbyte == CR && readChunk[curpos+1] == LF) {
          startpos++;
          curpos++;
        }
      }
      seenCR = curbyte == CR && atend;
      curpos++;
    }
    position += bytesRead;
    if (startpos < bytesRead) {
      lineBuffer = _concat(lineBuffer, readChunk.slice(startpos));
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

  let newLength = buffOne.length + buffTwo.length;
  return Buffer.concat([buffOne, buffTwo], newLength);
}

module.exports = readlines;
