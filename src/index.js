'use strict';

import fs from 'fs';
import path from 'path';
import polyfill from 'babel/polyfill';

function readlines(fname='./test.txt') {
  let position = 0;
  fs.stat(fname, function(err, stats) {
    if (err) throw new Error(err);
    fs.open(fname, 'r', function(err, fd) {
      if (err) throw new Error(err);
      chunk(fd, stats.size, position);
    });
  });
}

function chunk(fd, maxLength, position=0, lineBuffer, bufferSize=80) {
  let remaining = maxLength - position;

  if (remaining > 0 && remaining < bufferSize) bufferSize = remaining;
  else if (remaining <= 0) return done(fd);

  fs.read(fd, new Buffer(bufferSize), 0, bufferSize, position, function(err, bytesRead, buffer) {
    if (err) throw new Error(err);

    var data = buffer.toString();
    let found_newline = findLine(data);
    if (found_newline === -1) {
      let newBuffer = concat(lineBuffer, buffer);
      chunk(fd, maxLength, position + bufferSize, newBuffer);
      return;
    }

    var newlineBuffer = new Buffer(data.substring(0, found_newline));
    line(concat(lineBuffer, newlineBuffer));
    chunk(fd, maxLength, position + bufferSize);
  });
}

function concat(buff_one, buff_two) {
  if (!buff_one) return buff_two;
  if (!buff_two) return buff_one;
  let new_length = buff_one.length + buff_two.length;

  return Buffer.concat([buff_one, buff_two], new_length);
}

function done(fd) {
  console.log('All done!');
}

function line(lineBuffer) {
  console.log('Found line!');
  console.log(lineBuffer.toString());
  console.log('===============');
}

function findLine(chunk) {
  return chunk.search(/\r\n|\r|\n/);
}

module.exports = readlines;