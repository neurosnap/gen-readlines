'use strict';

const readline = require('linebyline');
const timer = process.hrtime();
const rl = readline('./tale_two_cities.txt');

rl.on('line', function () {}).on('end', function () {
  const diff = process.hrtime(timer);
  console.log('Benchmark took %d nanoseconds', diff[0] * 1e9 + diff[1]);
});
