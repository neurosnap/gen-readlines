'use strict';

const readlines = require('..');
const fs = require('fs');

const fd = fs.openSync('./tale_two_cities.txt', 'r');
const stats = fs.fstatSync(fd);
const timer = process.hrtime();

for (const line of readlines(fd, stats.size)) {
  line.toString();
}

const diff = process.hrtime(timer);
console.log('Benchmark took %d nanoseconds', diff[0] * 1e9 + diff[1]);
fs.closeSync(fd);
