Generator Line Reader
=====================

Generator based line reader that only blocks when reading a line.

Usage
-----

```
var Readlines = require('gen-readline');

var rl = new Readlines();
rl.open('./test.txt').then(function(ctx) {
	for (var line of ctx.lines()) {
		console.log(line.toString());
	}
});
rl.close().then(function(ctx) {
	console.log('File closed!');
	console.log(ctx.is_open);
});
```

Creating an instance of the `Readlines` class with a filename
will return a promise to open the file and get its file size.

```
import Readlines from 'gen-readline';

(async function() {
	let rl = new Readlines();
	await rl.open('./test.txt');

	for (let line of rl.lines()) {
		console.log(line);
	}

	await rl.close();
})();
```

Already have the integer representing the file descriptor for the file and its file size?

```
var fd = fs.openSync('./test.txt', 'r');
var stats = fs.statSync('./test.txt');

var rl = new Readlines(fd, stats.size);
for (var line of rl.lines()) {
	console.log(line.toString());
}

fs.closeSync(fd);
```

Credits
-------

* Eric Bower