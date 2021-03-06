import fs from 'fs';
import assert from 'assert';

import { fromFile } from '../index';

describe('The hipster file with simplified API', function () {
  let expectedLines: string[];
  let actualLines: string[];

  before(function () {
    expectedLines = fs
      .readFileSync('./test_data/hipster.txt')
      .toString()
      .split('\n');
    actualLines = [];
    for (let line of fromFile('./test_data/hipster.txt')) {
      actualLines.push(line.toString());
    }
  });

  it('should return 24 lines', function () {
    assert.strictEqual(actualLines.length, 24);
  });

  it('parsed lines must match original lines', function () {
    assert.deepStrictEqual(actualLines, expectedLines);
  });

  it('parsed lines must not contain \\n', function () {
    actualLines.forEach(function (line) {
      assert.ok(/\\n/.exec(line) === null);
    });
  });
});

describe('The hipster windos file with simplified API', function () {
  let expectedLines: string[];
  let actualLines: string[];

  before(function () {
    expectedLines = fs
      .readFileSync('./test_data/hipster_windos.txt')
      .toString()
      .split('\r\n');
    actualLines = [];
    for (let line of fromFile('./test_data/hipster_windos.txt')) {
      actualLines.push(line.toString());
    }
  });

  it('should return 24 lines', function () {
    assert.strictEqual(actualLines.length, 24);
  });

  it('parsed lines must match original lines', function () {
    assert.deepStrictEqual(actualLines, expectedLines);
  });

  it('parsed lines must not contain \\r nor \\n', function () {
    actualLines.forEach(function (line) {
      assert.ok(/\\r|\\n/.exec(line) === null);
    });
  });
});

describe('The empty file with simplified API', function () {
  it('should return 0 lines', function () {
    const lines = [];
    for (let line of fromFile('./test_data/empty_file.txt')) {
      lines.push(line);
    }

    assert.strictEqual(0, lines.length);
  });
});

describe('The multibyte file with simplified API', function () {
  it('should return 4 lines', function () {
    const lines = [];
    for (let line of fromFile('./test_data/multibyte_file.txt', {
      bufferSize: 1,
    })) {
      lines.push(line);
    }

    assert.strictEqual(4, lines.length);
  });
});

describe('The multibyte windos file with simplified API', function () {
  it('should return 4 lines', function () {
    const lines = [];
    for (let line of fromFile('./test_data/multibyte_windos_file.txt', {
      bufferSize: 1,
    })) {
      lines.push(line);
    }

    assert.strictEqual(4, lines.length);
  });
});

describe('The normal file with simplified API', function () {
  it('should return 6 lines', function () {
    const lines = [];
    for (let line of fromFile('./test_data/normal_file.txt')) {
      lines.push(line);
    }

    assert.strictEqual(6, lines.length);
  });
});

describe('The one line file with simplified API', function () {
  it('should return 1 line', function () {
    const lines = [];
    for (let line of fromFile('./test_data/one_line_file.txt')) {
      lines.push(line);
    }

    assert.strictEqual(1, lines.length);
  });
});

describe('The three line file with simplified API', function () {
  it('should return 3 lines', function () {
    const lines = [];
    for (let line of fromFile('./test_data/three_line_file.txt')) {
      lines.push(line);
    }

    assert.strictEqual(3, lines.length);
  });
});

describe('File with empty lines with simplified API', function () {
  it('should return 4 lines', function () {
    const lines = [];
    for (let line of fromFile('./test_data/empty_lines.txt')) {
      lines.push(line.toString());
    }

    assert.strictEqual(4, lines.length);
  });

  it('should return the correct text for each line', function () {
    const lines = [];
    for (let line of fromFile('./test_data/empty_lines.txt')) {
      lines.push(line.toString());
    }

    const expectedLines = [
      'Here is one line with text.',
      '',
      '',
      'Here is another line with gaps between.',
    ];

    for (let i = 0; i < lines.length; i++) {
      assert.strictEqual(expectedLines[i], lines[i]);
    }
  });
});

describe('The simplified API with the maximum line length limited', function () {
  it('should return 6 instead of 3 lines', function () {
    const lines = [];
    for (let line of fromFile('./test_data/three_line_file.txt', {
      maxLineLength: 10,
    })) {
      lines.push(line);
    }
    assert.strictEqual(6, lines.length);
  });
});
