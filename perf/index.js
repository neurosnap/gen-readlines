const createSuite = require('./createSuite');
const { createReadStream, open, close, fstat } = require('fs');
const { join } = require('path');
const byline = require('byline');
const lineReader = require('line-reader');
const linebyline = require('linebyline');
const readline = require('readline');
const readlines = require('..');

const testFile = join(__dirname, 'tale_two_cities.txt');

function usingByline(deferred) {
  byline(createReadStream(testFile, { encoding: 'utf8' }))
    .on('data', function () {})
    .on('end', function () {
      deferred.resolve();
    });
}

function usingLineReader(deferred) {
  lineReader.eachLine(testFile, function (line, last) {
    if (last) {
      deferred.resolve();
    }
  });
}

function usingLinebyline(deferred) {
  linebyline(testFile)
    .on('line', function () {})
    .on('end', function () {
      deferred.resolve();
    });
}

function usingReadline(deferred) {
  readline
    .createInterface({ input: createReadStream(testFile) })
    .on('line', function () {})
    .on('close', function () {
      deferred.resolve();
    });
}

function usingGenReadlinesReturning(deferred) {
  open(testFile, 'r', function (err, fd) {
    fstat(fd, function (err, stats) {
      for (const line of readlines(fd, stats.size)) {
        line.toString();
      }
      close(fd, function () {});
      deferred.resolve();
    });
  });
}

function usingGenReadlinesSkipping(deferred) {
  open(testFile, 'r', function (err, fd) {
    fstat(fd, function (err, stats) {
      for (const line of readlines(fd, stats.size)) {
      }
      close(fd, function () {});
      deferred.resolve();
    });
  });
}

createSuite('Reading lines using...')
  .add('byline', usingByline, { defer: true })
  .add('line-reader', usingByline, { defer: true })
  .add('linebyline', usingLinebyline, { defer: true })
  .add('readline', usingReadline, { defer: true })
  .add('gen-readlines returning each line', usingGenReadlinesReturning, {
    defer: true,
  })
  .add('gen-readlines skipping all lines', usingGenReadlinesSkipping, {
    defer: true,
  })
  .start();
