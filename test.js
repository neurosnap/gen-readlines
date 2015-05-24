var fs = require('fs');
var readlines = require('./dist/index');

var fd = fs.openSync('./tests/data/multibyte_file.txt', 'r');
var stats = fs.statSync('./tests/data/multibyte_file.txt');

for (var line of readlines(fd, stats.size)) {
  console.log(line.toString());
}

fs.closeSync(fd);