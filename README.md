Generator Line Reader
=====================

Generator based line reader that only blocks when reading a line.

Usage
-----

Provide readlines with a file descriptor and the size of the file and it will
create a generator which will iterate through all the lines in that file.

```
var fs = require('fs');
var readlines = require('readlines');

var fd = fs.openSync('./test.txt', 'r');
var stats = fs.statSync('./test.txt');

for (var line of readlines(fd, stats.size)) {
	console.log(line.toString());
}

fs.closeSync(fd);
```

Credits
-------

* Eric Bower