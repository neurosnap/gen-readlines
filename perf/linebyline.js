'use strict';

var readline = require('linebyline');

var timer = process.hrtime();

var rl = readline('./tale_two_cities.txt');

rl.on('line', function(line, lineCount, byteCount) {
})
.on('end', function(line, lineCount, byteCount) {
    var diff = process.hrtime(timer);
    console.log('Benchmark took %d nanoseconds', diff[0] * 1e9 + diff[1]);
});

