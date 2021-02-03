'use strict';

const fs = require('fs');
const assert = require('assert');

const readlines = require('./index');

describe('The hipster file', function() {
  let fd;
  let stats;
  let expectedLines;
  let actualLines;

  before(function() {
    fd = fs.openSync('./test_data/hipster.txt', 'r');
    stats = fs.statSync('./test_data/hipster.txt');
    expectedLines = fs.readFileSync('./test_data/hipster.txt').toString().split('\n');
    actualLines = [];
    for (let line of readlines(fd, stats.size)) {
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
  let fd;
  let stats;
  let expectedLines;
  let actualLines;

  before(function() {
    fd = fs.openSync('./test_data/hipster_windos.txt', 'r');
    stats = fs.statSync('./test_data/hipster_windos.txt');
    expectedLines = fs.readFileSync('./test_data/hipster_windos.txt').toString().split('\r\n');
    actualLines = [];
    for (let line of readlines(fd, stats.size)) {
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
  let fd;
  let stats;

  before(function() {
    fd = fs.openSync('./test_data/empty_file.txt', 'r');
    stats = fs.statSync('./test_data/empty_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 0 lines', function() {
    const lines = [];
    for (let line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(0, lines.length);
  });
});

describe('The multibyte file', function() {
  let fd;
  let stats;

  before(function() {
    fd = fs.openSync('./test_data/multibyte_file.txt', 'r');
    stats = fs.statSync('./test_data/multibyte_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 4 lines', function() {
    const lines = [];
    for (let line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(4, lines.length);
  });
});

describe('The multibyte windos file', function() {
  let fd;
  let stats;

  before(function() {
    fd = fs.openSync('./test_data/multibyte_windos_file.txt', 'r');
    stats = fs.statSync('./test_data/multibyte_windos_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 4 lines', function() {
    const lines = [];
    for (let line of readlines(fd, stats.size, 1)) {
      lines.push(line);
    }

    assert.equal(4, lines.length);
  });
});

describe('The normal file', function() {
  let fd;
  let stats;

  before(function() {
    fd = fs.openSync('./test_data/normal_file.txt', 'r');
    stats = fs.statSync('./test_data/normal_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 6 lines', function() {
    const lines = [];
    for (let line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(6, lines.length);
  });
});

describe('The one line file', function() {
  let fd;
  let stats;

  before(function() {
    fd = fs.openSync('./test_data/one_line_file.txt', 'r');
    stats = fs.statSync('./test_data/one_line_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 1 line', function() {
    const lines = [];
    for (let line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(1, lines.length);
  });
});

describe('The three line file', function() {
  let fd;
  let stats;

  before(function() {
    fd = fs.openSync('./test_data/three_line_file.txt', 'r');
    stats = fs.statSync('./test_data/three_line_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 3 lines', function() {
    const lines = [];
    for (let line of readlines(fd, stats.size)) {
      lines.push(line);
    }

    assert.equal(3, lines.length);
  });
});

describe('File with empty lines', function() {
  let fd;
  let stats;

  before(function() {
    fd = fs.openSync('./test_data/empty_lines.txt', 'r');
    stats = fs.statSync('./test_data/empty_lines.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 4 lines', function() {
    const lines = [];
    for (let line of readlines(fd, stats.size)) {
      lines.push(line.toString());
    }

    assert.equal(4, lines.length);
  });

  it('should return the correct text for each line', function() {
    const lines = [];
    for (let line of readlines(fd, stats.size)) {
      lines.push(line.toString());
    }

    const expectedLines = [
      'Here is one line with text.',
      '',
      '',
      'Here is another line with gaps between.',
    ];

    for (let i = 0; i < lines.length; i++) {
      assert.equal(expectedLines[i], lines[i]);
    }
  });
});

describe('The file with two CR-only line breaks', function() {
  let fd;
  let stats;

  before(function() {
    fd = fs.openSync('./test_data/cr_alone.txt', 'r');
    stats = fs.statSync('./test_data/cr_alone.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('should return 2 lines', function() {
    const lines = [];
    for (let line of readlines(fd, stats.size, 1)) {
      lines.push(line);
    }

    assert.equal(2, lines.length);
  });

  it('should not include CR characters in the returned lines', function() {
    const gen = readlines(fd, stats.size);
    // first line
    let entry = gen.next();
    assert.ok(!entry.done);
    let line = entry.value.toString();
    assert.ok(line.charCodeAt(line.length - 1) !== 13);
    // second line
    entry = gen.next();
    assert.ok(!entry.done);
    line = entry.value.toString();
    assert.ok(line.charCodeAt(line.length - 1) !== 13);
    // end
    entry = gen.next();
    assert.ok(entry.done);
  });
});

describe('With the maximum line length limited', function() {
  let fd;
  let stats;

  before(function() {
    fd = fs.openSync('./test_data/three_line_file.txt', 'r');
    stats = fs.statSync('./test_data/three_line_file.txt');
  });

  after(function() {
    fs.closeSync(fd);
  });

  it('the three line file should return 6 instead of 3 lines', function() {
    const lines = [];
    for (let line of readlines(fd, stats.size, undefined, undefined, 10)) {
      assert.ok(line.length <= 10);
      lines.push(line);
    }
    assert.equal(6, lines.length);
  });

  it('the maximum line length can be changed for an iteration', function() {
    const gen = readlines(fd, stats.size, undefined, undefined, 10);
    // first line
    let entry = gen.next();
    assert.ok(!entry.done);
    assert.ok(entry.value.length === 10);
    entry = gen.next();
    assert.ok(!entry.done);
    assert.ok(entry.value.length < 10);
    // second line
    entry = gen.next(5);
    assert.ok(!entry.done);
    assert.ok(entry.value.length === 5);
    entry = gen.next();
    assert.ok(!entry.done);
    assert.ok(entry.value.length === 10);
    entry = gen.next();
    assert.ok(!entry.done);
    assert.ok(entry.value.length < 10);
  });
});
