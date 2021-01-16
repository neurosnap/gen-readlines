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

## Maximum Line Length

You can limit the maximum line length. When the specified length is reached while reading a line, the buffer will be returned as a new line just like when a line break was encountered:

```js
// If original lines are longer than 255 characters, an artificial line break
// will be enforced after each 255 characters reached on a single line. More
// then original lines will be returned by the generator then.
var file = readlines(fd, stats.size, undefined, undefined, 255);
for (let line of readlines(fd, fileSize)) {
  console.log(line.toString());
}
```

You can change the maximum line length for each generated line. If you do not specify the maximum length, when you read the next line, the original maximum line length passed to `readlines` will be used:

```js
// Lines will not be longer than 255 characters by default.
var file = readlines(fd, stats.size, undefined, undefined, 255);
var line = file.next(); // 255 characters maximum
line = file.next(127);  // 127 characters maximum
line = file.next();     // 255 characters maximum again
```

*Note:* The very first generation (call to the `next` method) cannot accept an alternative maximum line length. It will always use the default value passed to `readlines`. First the following calls to `next` allow to specify alternative values. This is caused by the nature of JavaScript generators, which obtain the value from `yield` [first when when resuming the generation](https://stackoverflow.com/a/37355045/623816).

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

* node 6 or newer, to get access to generators and new methods of the `Buffer` object.

Documentation
-------------

#### readlines (fd, filesize, bufferSize=64\*1024, position=0, maxLineLength=Infinity)

 * fd {Number} The file descriptor
 * filesize {Number} The size of the file in bytes
 * bufferSize {Number} The size of the buffer in bytes, default: 64\*1024
 * position {Number} The position where to start reading the file in bytes, default: 0
 * maxLineLength {Number} The length to stop reading at if no line break has been reached, default: Infinity

#### readlines.fromFile (filename, bufferSize=64\*1024, maxLineLength=Infinity)

 * filename {string} Name of input file
 * bufferSize {Number} The size of the buffer in bytes, default: 64\*1024
 * maxLineLength {Number} The length to stop reading at if no line break has been reached, default: Infinity

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
