var fs = require('fs');
var Readlines = require('./dist/index');

var fd = fs.openSync('./test.txt', 'r');
var stats = fs.statSync('./test.txt');

var rl = new Readlines(fd, stats.size);
for (var line of rl.lines()) {
  console.log(line.toString());
}

console.log(rl.is_open);
rl.close().then(function(ctx) { console.log('file is closedddd'); });

console.log('===========');

var rl = new Readlines();
rl.open('./test.txt')
  .then(function(ctx) {
    for (var line of ctx.lines()) {
      console.log(line.toString());
    }
  }).catch(function(err) {
    throw err;
  });

console.log(rl);

rl.close().then(function() {
  console.log('file closed');
});