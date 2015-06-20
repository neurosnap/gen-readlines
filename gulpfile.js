'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');

gulp.task('default', ['babel']);

gulp.task('babel', function() {
  var src = './src/index.js';
  var dist = './';

  gutil.log('Babel is generating ' + src + ' files to ' + dist + ' ...');

  return gulp.src(src)
    .pipe(babel({ stage: 0 }))
    .pipe(gulp.dest(dist));
});

gulp.task('test', function() {
    return gulp.src('./tests.js', { read: false })
        .pipe(mocha());
});

gulp.task('watch', function() {
	gutil.log('Watching node modules ...');
	gulp.watch('./src/index.js', ['babel']);
});