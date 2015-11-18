Generator Line Reader [![Build Status](https://travis-ci.org/neurosnap/gen-readlines.svg?branch=master)](https://travis-ci.org/neurosnap/gen-readlines)
=====================

Generator based line reader that only blocks when reading a line.

Install
-------

```
npm install gen-readlines
```

Usage
-----

Provide readlines with a file descriptor and the size of the file and it will
create a generator which will iterate through all the lines in that file.

```
var fs = require('fs');
var readlines = require('gen-readlines');

var fd = fs.openSync('./test_data/hipster.txt', 'r');
var stats = fs.fstatSync(fd);

for (var line of readlines(fd, stats.size)) {
	console.log(line.toString());
}

fs.closeSync(fd);
```

```
fs.open('./test_data/hipster.txt', 'r', function(err, fd) {
  if (err) throw err;
  fs.fstat(fd, function(err, stats) {
    if (err) throw err;

    for (var line of readlines(fd, stats.size)) {
      console.log(line.toString());
    }

  });
});
```

`readlines` returns a generator object and calling `next` will get the next
line as a [buffer object](https://nodejs.org/api/buffer.html):

```
var file = readlines(fd, stats.size);
var line = file.next();
console.log(line);
> { value: <Buffer 42 65 73 70 ... >, done: false }
```

Convert the buffer to a string:

```
line.toString();
> This is the first line of the file
```

Compatibility
-------------

* node 0.11.x or greater, with `--harmony-generators` flag or `--harmony` to get access to generators.
* io.js is supported without any flags.

Documentation
-------------

#### readlines (fd, filesize, bufferSize=64\*1024, position=0)

 * fd {Number} The file descriptor
 * filesize {Number} The size of the file in bytes
 * bufferSize {Number} The size of the buffer in bytes, default: 64\*1024
 * position {Number} The position where to start reading the file in bytes, default: 0

Testing
-------

We are using `mocha` for unit testing

```
npm test
```

Credits
-------

* Eric Bower
