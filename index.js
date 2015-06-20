'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _babelPolyfill = require('babel/polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var newline_chars = [13, 10];

var readlines = regeneratorRuntime.mark(function readlines(fd, filesize) {
  var bufferSize = arguments[2] === undefined ? 1024 : arguments[2];
  var position = arguments[3] === undefined ? 0 : arguments[3];
  return regeneratorRuntime.wrap(function readlines$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.delegateYield(_readlines(fd, filesize, bufferSize, position), 't0', 1);

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, readlines, this);
});

var _readlines = regeneratorRuntime.mark(function _readlines(fd, filesize, bufferSize, position) {
  var lineBuffer, remaining, read_chunk, found_newline, newlineBuffer;
  return regeneratorRuntime.wrap(function _readlines$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        lineBuffer = undefined;

      case 1:
        if (!(position < filesize)) {
          context$1$0.next = 30;
          break;
        }

        console.log(bufferSize);
        remaining = filesize - position;

        if (remaining < bufferSize) bufferSize = remaining;

        read_chunk = new Buffer(bufferSize);
        context$1$0.prev = 6;

        _fs2['default'].readSync(fd, read_chunk, 0, bufferSize, position);
        context$1$0.next = 13;
        break;

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](6);
        throw context$1$0.t0;

      case 13:
        found_newline = _foundNewline(read_chunk);

        if (!(found_newline == -1)) {
          context$1$0.next = 19;
          break;
        }

        lineBuffer = _concat(lineBuffer, read_chunk);
        position += bufferSize;
        context$1$0.next = 28;
        break;

      case 19:
        if (!(found_newline == 0)) {
          context$1$0.next = 23;
          break;
        }

        position += 1;
        context$1$0.next = 28;
        break;

      case 23:
        newlineBuffer = new Buffer(read_chunk.slice(0, found_newline));
        context$1$0.next = 26;
        return _concat(lineBuffer, newlineBuffer);

      case 26:
        position += newlineBuffer.length;
        lineBuffer = undefined;

      case 28:
        context$1$0.next = 1;
        break;

      case 30:
        if (!Buffer.isBuffer(lineBuffer)) {
          context$1$0.next = 33;
          break;
        }

        context$1$0.next = 33;
        return lineBuffer;

      case 33:
      case 'end':
        return context$1$0.stop();
    }
  }, _readlines, this, [[6, 10]]);
});

function _foundNewline(read_chunk) {
  for (var i = 0; i < read_chunk.length; i++) {
    if (newline_chars.indexOf(read_chunk[i]) >= 0) {
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

// dump what ever is left in the buffer