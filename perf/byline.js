const fs = require('fs');
const byline = require('byline');

const timer = process.hrtime();
const stream = byline(fs.createReadStream('./tale_two_cities.txt', { encoding: 'utf8' }));

stream.on('data', function() {})
  .on('end', function() {
    const diff = process.hrtime(timer);
    console.log('Benchmark took %d nanoseconds', diff[0] * 1e9 + diff[1]);
  });
