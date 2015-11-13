'use strict';

var fs = require('fs');
var assert = require('assert');

var readlines = require('./index');

describe('The hipster file', function() {
  var fd, stats;

  before(function() {
    fd = fs.openSync('./test_data/hipster.txt', 'r');
    stats = fs.statSync('./test_data/hipster.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 22 lines', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(22, lines.length);
  });
});

describe('The empty file', function() {
  var fd, stats;

  before(function() {
    fd = fs.openSync('./test_data/empty_file.txt', 'r');
    stats = fs.statSync('./test_data/empty_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 0 lines', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(0, lines.length);
  });
});

describe('The multibyte file', function() {
  var fd, stats;

  before(function() {
    fd = fs.openSync('./test_data/multibyte_file.txt', 'r');
    stats = fs.statSync('./test_data/multibyte_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 3 lines', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(3, lines.length);
  });
});

describe('The normal file', function() {
  var fd, stats;

  before(function() {
    fd = fs.openSync('./test_data/normal_file.txt', 'r');
    stats = fs.statSync('./test_data/normal_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 3 lines', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size)) {
      lines.push(line);
    }
    assert.equal(3, lines.length);
  });
});

describe('The one line file', function() {
  var fd, stats;

  before(function() {
    fd = fs.openSync('./test_data/one_line_file.txt', 'r');
    stats = fs.statSync('./test_data/one_line_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 1 line', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(1, lines.length);
  });
});

describe('The three line file', function() {
  var fd, stats;

  before(function() {
    fd = fs.openSync('./test_data/three_line_file.txt', 'r');
    stats = fs.statSync('./test_data/three_line_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 3 lines', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(3, lines.length);
  });
});

describe('File with empty lines', function() {
  var fd, stats;

  before(function() {
    fd = fs.openSync('./test_data/empty_lines.txt', 'r');
    stats = fs.statSync('./test_data/empty_lines.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 4 lines', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(4, lines.length);
  });
});

