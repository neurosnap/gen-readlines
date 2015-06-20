'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _babelPolyfill = require('babel/polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var newline_chars = [13, 10];

var readlines = regeneratorRuntime.mark(function readlines(fd, filesize) {
  var bufferSize = arguments[2] === undefined ? 1024 : arguments[2];
  return regeneratorRuntime.wrap(function readlines$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.delegateYield(_readlines(fd, filesize, bufferSize, 0), 't0', 1);

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, readlines, this);
});

var _readlines = regeneratorRuntime.mark(function _readlines(fd, filesize, bufferSize, position, lineBuffer) {
  var remaining, chunk, found_newline, newlineBuffer;
  return regeneratorRuntime.wrap(function _readlines$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(position < filesize)) {
          context$1$0.next = 28;
          break;
        }

        remaining = filesize - position;

        if (remaining < bufferSize) bufferSize = remaining;

        chunk = new Buffer(bufferSize);
        context$1$0.prev = 4;

        _fs2['default'].readSync(fd, chunk, 0, bufferSize, position);
        context$1$0.next = 11;
        break;

      case 8:
        context$1$0.prev = 8;
        context$1$0.t0 = context$1$0['catch'](4);
        throw context$1$0.t0;

      case 11:
        found_newline = _foundNewline(chunk);

        if (!(found_newline == -1)) {
          context$1$0.next = 17;
          break;
        }

        lineBuffer = _concat(lineBuffer, chunk);
        position += bufferSize;
        context$1$0.next = 26;
        break;

      case 17:
        if (!(found_newline == 0)) {
          context$1$0.next = 21;
          break;
        }

        position += 1;
        context$1$0.next = 26;
        break;

      case 21:
        newlineBuffer = new Buffer(chunk.slice(0, found_newline));
        context$1$0.next = 24;
        return _concat(lineBuffer, newlineBuffer);

      case 24:
        position += newlineBuffer.length;
        lineBuffer = undefined;

      case 26:
        context$1$0.next = 0;
        break;

      case 28:
        if (!Buffer.isBuffer(lineBuffer)) {
          context$1$0.next = 31;
          break;
        }

        context$1$0.next = 31;
        return lineBuffer;

      case 31:
      case 'end':
        return context$1$0.stop();
    }
  }, _readlines, this, [[4, 8]]);
});

function _foundNewline(chunk) {
  for (var i = 0; i < chunk.length; i++) {
    if (newline_chars.indexOf(chunk[i]) >= 0) {
      return i;
    }
  }
  return -1;
}

function _concat(buff_one, buff_two) {
  if (!buff_one) return buff_two;
  if (!buff_two) return buff_one;
  var new_length = buff_one.length + buff_two.length;

  return Buffer.concat([buff_one, buff_two], new_length);
}

module.exports = readlines;