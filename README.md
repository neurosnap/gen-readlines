Generator Line Reader
=====================

Generator based line reader that only blocks when reading a line.

Usage
-----

```
var Readlines = require('gen-readline');

new Readlines('./test.txt').then(function(ctx) {
	for (var line of ctx.lines()) {
		console.log(line.toString());
	}
}).catch(function(err) {
	throw err;
});
```

Creating an instance of the `Readlines` class with a filename
will return a promise to open the file and get its file size.

```
import Readlines from 'gen-readline';

(async function() {
	try {
		let rl = await new Readlines('./test.txt');
	} catch (err) {
		throw err;
	}

	for (let line of rl.lines()) {
		console.log(line);
	}
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
```

Credits
-------

* Eric Bower