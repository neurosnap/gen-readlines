'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _babelPolyfill = require('babel/polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var newlineChars = [13, 10];

function readlines(fd, filesize) {
  var bufferSize = arguments[2] === undefined ? 1024 : arguments[2];
  var position = arguments[3] === undefined ? 0 : arguments[3];

  return _readlines(fd, filesize, bufferSize, position);
}

var _readlines = regeneratorRuntime.mark(function _readlines(fd, filesize, bufferSize, position) {
  var lineBuffer, remaining, readChunk, foundNewline, newlineBuffer;
  return regeneratorRuntime.wrap(function _readlines$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        lineBuffer = undefined;

      case 1:
        if (!(position < filesize)) {
          context$1$0.next = 24;
          break;
        }

        remaining = filesize - position;

        if (remaining < bufferSize) bufferSize = remaining;

        readChunk = new Buffer(bufferSize);
        context$1$0.prev = 5;

        _fs2['default'].readSync(fd, readChunk, 0, bufferSize, position);
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0['catch'](5);
        throw context$1$0.t0;

      case 12:
        foundNewline = _foundNewline(readChunk);

        if (!(foundNewline > 0)) {
          context$1$0.next = 21;
          break;
        }

        newlineBuffer = new Buffer(readChunk.slice(0, foundNewline));
        context$1$0.next = 17;
        return _concat(lineBuffer, newlineBuffer);

      case 17:

        position += newlineBuffer.length;
        lineBuffer = undefined;
        context$1$0.next = 22;
        break;

      case 21:
        if (foundNewline == -1) {
          position += bufferSize;
          lineBuffer = _concat(lineBuffer, readChunk);
        } else if (foundNewline == 0) {
          position += 1;
        }

      case 22:
        context$1$0.next = 1;
        break;

      case 24:
        if (!Buffer.isBuffer(lineBuffer)) {
          context$1$0.next = 27;
          break;
        }

        context$1$0.next = 27;
        return lineBuffer;

      case 27:
      case 'end':
        return context$1$0.stop();
    }
  }, _readlines, this, [[5, 9]]);
});

function _foundNewline(readChunk) {
  for (var i = 0; i < readChunk.length; i++) {
    if (newlineChars.indexOf(readChunk[i]) >= 0) return i;
  }return -1;
}

function _concat(buffOne, buffTwo) {
  if (!buffOne) return buffTwo;
  if (!buffTwo) return buffOne;

  var newLength = buffOne.length + buffTwo.length;
  return Buffer.concat([buffOne, buffTwo], newLength);
}

module.exports = readlines;

// dump what ever is left in the buffer