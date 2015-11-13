'use strict';

var readlines = require('../index');
var fs = require('fs');

var fd = fs.openSync('./tale_two_cities.txt', 'r');
var stats = fs.fstatSync(fd);

var timer = process.hrtime();

for (var line of readlines(fd, stats.size)) {
    //console.log(line.toString());
    //line.toString();
}

var diff = process.hrtime(timer);

console.log('Benchmark took %d seconds', diff[0] * 1e9 + diff[1]);

fs.closeSync(fd);
