'use strict';

const lineReader = require('line-reader');
const timer = process.hrtime();

lineReader.eachLine('./tale_two_cities.txt', function (line, last) {
  if (last) {
    const diff = process.hrtime(timer);
    console.log('Benchmark took %d nanoseconds', diff[0] * 1e9 + diff[1]);
  }
});
