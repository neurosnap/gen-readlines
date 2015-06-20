'use strict';

var fs = require('fs');
var assert = require('assert');

var readlines = require('./index');

describe('The hipster file', function() {
    var fd, stats;

    before(function() {
        fd = fs.openSync('./test_data/hipster.txt', 'r');
        stats = fs.statSync('./test_data/hipster.txt');
    });

    after(function() {
        fs.closeSync(fd);
    });

    it('should return 22 lines', function() {
        var lines = [];
        for (var line of readlines(fd, stats.size)) {
            lines.push(line);
        }
        assert.equal(22, lines.length);
    });
});
