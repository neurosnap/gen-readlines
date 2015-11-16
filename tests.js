'use strict';

var fs = require('fs');
var assert = require('assert');

var readlines = require('./index');

describe('The hipster file', function() {
  var fd, stats, expectedLines, actualLines;

  before(function() {
    fd = fs.openSync('./test_data/hipster.txt', 'r');
    stats = fs.statSync('./test_data/hipster.txt');
    expectedLines = fs.readFileSync('./test_data/hipster.txt').toString().split('\n');
    actualLines = [];
    for (var line of readlines(fd, stats.size)) {
      actualLines.push(line.toString());
    }
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 24 lines', function() {
    assert.equal(actualLines.length, 24);
  });

  it('parsed lines must match original lines', function() {
    assert.deepEqual(actualLines, expectedLines);
  });

  it('parsed lines must not contain \\n', function() {
    actualLines.forEach(function(line) {
      assert.ok(/\\n/.exec(line) === null);
    });
  });
});

describe('The hipster windos file', function() {
  var fd, stats, expectedLines, actualLines;

  before(function() {
    fd = fs.openSync('./test_data/hipster_windos.txt', 'r');
    stats = fs.statSync('./test_data/hipster_windos.txt');
    expectedLines = fs.readFileSync('./test_data/hipster_windos.txt').toString().split('\r\n');
    actualLines = [];
    for (var line of readlines(fd, stats.size)) {
      actualLines.push(line.toString());
    }
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 24 lines', function() {
    assert.equal(actualLines.length, 24);
  });

  it('parsed lines must match original lines', function() {
    assert.deepEqual(actualLines, expectedLines);
  });

  it('parsed lines must not contain \\r nor \\n', function() {
    actualLines.forEach(function(line) {
      assert.ok(/\\r|\\n/.exec(line) === null);
    });
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

  it('should return 4 lines', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(4, lines.length);
  });
});

describe('The multibyte windos file', function() {
  var fd, stats;

  before(function() {
    fd = fs.openSync('./test_data/multibyte_windos_file.txt', 'r');
    stats = fs.statSync('./test_data/multibyte_windos_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 4 lines', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size, 1)) {
      lines.push(line);
    }

    assert.equal(4, lines.length);
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

  it('should return 6 lines', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(6, lines.length);
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
      lines.push(line.toString());
    }

    assert.equal(4, lines.length);
  });

  it('should return the correct text for each line', function() {
    var lines = [];
    for (var line of readlines(fd, stats.size)) {
      lines.push(line.toString());
    }

    var expected_lines = [
      'Here is one line with text.',
      '',
      '',
      'Here is another line with gaps between.'
    ];

    for (var i = 0; i < lines.length; i++) {
      assert.equal(expected_lines[i], lines[i]);
    }
  });
});

