gen-readlines [![Build Status](https://travis-ci.org/neurosnap/gen-readlines.svg?branch=master)](https://travis-ci.org/neurosnap/gen-readlines)
=====================

A generator based line reader. This node package will return the lines of a file
as a generator when given file descriptor and the size of the file.

Why?
---

I created this project primarily for better flow control of reading lines in a file.
Instead of using callbacks for reading lines within a file, this will use a generator which has some unique benefits.

* Because it is a generator, the lines of the file are not stored in a large array
* Code is synchronous, so you don't have to worry about the asynchronous effects of waiting for a callback
* Performant, our micro-benchmark demonstrates it can compete with callback-based line readers and in fact appears to be faster.

Install
-------

```
npm install gen-readlines
```

Usage
-----

Provide `gen-readlines` with a file descriptor and the size of the file and it will
create a generator which will iterate through all the lines in that file.

```js
const fs = require('fs');
const util = require('util');
const readlines = require('gen-readlines');

const open = util.promisify(fs.open);
const fstat = util.promisify(fs.fstat);

function* readFile() {
  const fd = yield open('./file.txt');
  const stat = yield fstat(fd);
  const fileSize = stat.size;

  for (let line of readlines(fd, fileSize)) {
    console.log(line.toString());
  }

  console.log('continue code execution, no callbacks!');

  fs.closeSync(fd);
}
```

`readlines` returns a generator object and calling `next` will get the next
line as a [buffer object](https://nodejs.org/api/buffer.html):

```js
var file = readlines(fd, stats.size);
var line = file.next();
console.log(line);
// { value: <Buffer 42 65 73 70 ... >, done: false }
```

Convert the buffer to a string:

```js
line.toString();
// This is the first line of the file
```

## Simplified API

Also you can use the simplified version of `readlines`:
```js
const readlines = require('gen-readlines');

for (let line of readlines.fromFile('./file.txt')) {
  console.log(line.toString());
}
```

Compatibility
-------------

* node 0.11.x or greater, with `--harmony-generators` flag or `--harmony` to get access to generators.

Documentation
-------------

#### readlines (fd, filesize, bufferSize=64\*1024, position=0)

 * fd {Number} The file descriptor
 * filesize {Number} The size of the file in bytes
 * bufferSize {Number} The size of the buffer in bytes, default: 64\*1024
 * position {Number} The position where to start reading the file in bytes, default: 0

#### readlines.fromFile (filename)

 * filename {string} Name of input file

Testing
-------

We are using `mocha` for unit testing

```
npm test
```

Performance
-----------

`./perf` contains a micro-benchmark, ran each benchmark five times and then averaged the results:

| Package       | Runtime (nanoseconds) |
|---------------|-----------------------|
| readline      | 17769036.4            |
| gen-readlines | 24480520.4            |
| linebyline    | 26549054.2            |
| byline        | 41573681.0            |
| line-reader   | 58315530.0            |
