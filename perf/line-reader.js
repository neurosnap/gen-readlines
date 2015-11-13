'use strict';

var lineReader = require('line-reader');

var timer = process.hrtime();

lineReader.eachLine('./tale_two_cities.txt', function(line, last) {
    //line;
    if(last) {
        var diff = process.hrtime(timer);
        console.log('Benchmark took %d nanoseconds', diff[0] * 1e9 + diff[1]);
    }
});
