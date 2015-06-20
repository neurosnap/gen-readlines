var fs = require('fs');
var readlines = require('./dist/index');

var fd = fs.openSync('./tests/data/hipster.txt', 'r');
var stats = fs.statSync('./tests/data/hipster.txt');

for (var line of readlines(fd, stats.size)) {
  console.log(line.toString());
}

var list = [];
for (var line of readlines(fd, stats.size)) {
    list.push(line);
}

console.log(list.length);

fs.closeSync(fd);