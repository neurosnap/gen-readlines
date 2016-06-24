const readline = require('readline');
const timer = process.hrtime();

const lineReader = readline.createInterface({
  input: require('fs').createReadStream('./tale_two_cities.txt'),
});

lineReader.on('line', function () {});
lineReader.on('close', function () {
  const diff = process.hrtime(timer);
  console.log('Benchmark took %d nanoseconds', diff[0] * 1e9 + diff[1]);
});
