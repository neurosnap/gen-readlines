var fs = require('fs');
var Readlines = require('./dist/index');

var fd = fs.openSync('./test.txt', 'r');
var stats = fs.statSync('./test.txt');

var rl = new Readlines(fd, stats.size);
for (var line of rl.lines()) {
  console.log(line.toString());
}

rl.close().then(function() { console.log('file closed!'); });

console.log('===========');

new Readlines('./test.txt').then(function(ctx) {
  for (var line of ctx.lines()) {
    console.log(line.toString());
  }
}).catch(function(err) {
  console.log(err);
});