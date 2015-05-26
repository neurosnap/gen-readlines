'use strict';

import fs from 'fs';
import { StringDecoder } from 'string_decoder';

import polyfill from 'babel/polyfill';

var newline_chars = [
  13,
  10
];

var readlines = function* (fd, filesize, bufferSize=1024, encoding='utf8') {
  let decoder = new StringDecoder(encoding);
  yield* _readlines(fd, filesize, bufferSize, decoder, 0);
};

var _readlines = function* (fd, filesize, bufferSize, decoder, position, lineBuffer) {
  while (position < filesize) {
    let remaining = filesize - position;
    let tmpBufferSize = bufferSize;
    if (remaining < bufferSize) tmpBufferSize = remaining;

    let chunk = new Buffer(tmpBufferSize);
    try {
      fs.readSync(fd, chunk, 0, tmpBufferSize, position);
    } catch (err) {
      throw new Error(err);
    }

    let found_newline = _newlineFound(chunk);
    if (found_newline == -1) {
      lineBuffer = _concat(lineBuffer, chunk);
      position += tmpBufferSize;
      yield* _readlines(fd, filesize, bufferSize, decoder, position, lineBuffer);
      return;
    } else if (found_newline == 0) {
      position += 1;
      yield* _readlines(fd, filesize, bufferSize, decoder, position, lineBuffer);
      return;
    }

    let newlineBuffer;
    if (chunk.length == found_newline) newlineBuffer = chunk;
    else newlineBuffer = new Buffer(chunk.slice(0, found_newline));

    yield _concat(lineBuffer, newlineBuffer);
    position += newlineBuffer.length;
    lineBuffer = undefined;

    let leftoverBuffer = new Buffer(chunk.slice(found_newline));
    let lines = _newlines(leftoverBuffer);
    for (let line of lines) {
      if (Buffer.isBuffer(line)) yield line;
      else lineBuffer = line.partial;
    }
    position += leftoverBuffer.length;
  }
  if (Buffer.isBuffer(lineBuffer)) yield lineBuffer;
};

var _newlines = function* (buffer) {
  let newlineBuffer = _nlBuffer(buffer);
  if (newlineBuffer.length == 0) {
    yield { partial: buffer };
    return;
  }

  yield newlineBuffer[0];

  if (newlineBuffer.length > 1) {
    yield* _newlines(newlineBuffer[1]);
  }
}

function _nlBuffer(buffer) {
  let found_newline = _newlineFound(buffer);
  if (found_newline == 0) {
    return _nlBuffer(new Buffer(buffer.slice(found_newline + 1)));
  } else if (found_newline > 0) {
    if (buffer.length == found_newline) return [buffer];
    let newlineBuffer = new Buffer(buffer.slice(0, found_newline));
    let leftoverBuffer = new Buffer(buffer.slice(newlineBuffer.length));
    return [newlineBuffer, leftoverBuffer];
  }
  return [];
}

function _newlineFound(chunk) {
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