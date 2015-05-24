var fs = require('fs');
var readlines = require('./dist/index');

var fd = fs.openSync('./test.txt', 'r');
var stats = fs.statSync('./test.txt');

for (var line of readlines(fd, stats.size)) {
  console.log(line.toString());
}

fs.closeSync(fd);