Changes
=======

v1.0.0

* :sparkles: Adds official typescript support
* :wrench: Replace deprecated constructor of Buffer with Buffer.alloc [#14](https://github.com/neurosnap/gen-readlines/pull/14)
* :sparkles: Allow limiting the maximum line length [#16](https://github.com/neurosnap/gen-readlines/pull/16)
* :sparkles: Support CR alone as a line break [#15](https://github.com/neurosnap/gen-readlines/pull/15)

v0.2.0
------

* Added new `fromFile` function by [Igor Kamyshev](https://github.com/igorkamyshev) [13](https://github.com/neurosnap/gen-readlines/pull/13)

v0.1.3
------

* Added `eslint` to the project
* Updated documentation to use `let` instead of `var`
* Added multiple versions of `node` to travis

v0.1.2
------

* More optimizations

v0.1.1
------

* [BUG] Windows newlines caused extra empty lines
* [BUG] Contents of file read multiple times because of miscalculated char position
* Improved optimization of line reader
* Added a microbenchmark

v0.1.0
------

* [BUG] Empty lines should be returned in the list of lines

v0.0.1
------

* Initial release
