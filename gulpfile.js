/*global require:true */
(function () {
  'use strict';

  var remoteWebsite = 'http://cdn.rawgit.com/';
  var remoteLibs = [
    'lcavadas/jquery/2.1.3/dist/jquery.min.js',
    'lcavadas/doT/1.0.1/doT.min.js',
    'lcavadas/Storage.js/4c0b9016c5536d55bf55e21bf4e83d29f3483750/build/storage.min.js',
    'lcavadas/arenite/0.0.6/js/extensions/bus/bus.js',
    'lcavadas/arenite/0.0.6/js/extensions/storage/storage.js',
    'lcavadas/arenite/0.0.6/js/extensions/template/dot.js',
    'lcavadas/arenite/0.0.6/js/extensions/router/router.js'
  ];
  var build = 'build/';

  var gulp = require('gulp');
  var uglify = require('gulp-uglify');
  var jshint = require('gulp-jshint');
  var concat = require('gulp-concat');
  var remoteSrc = require('gulp-remote-src');
  var gulpMerge = require('gulp-merge');
  var minifyHtml = require('gulp-minify-html');
  var minifyCSS = require('gulp-minify-css');
  var less = require('gulp-less');

  gulp.task('default', ['html', 'css', 'js', 'min']);

  gulp.task('min', function () {
    gulpMerge(remoteSrc(remoteLibs, {base: remoteWebsite}), gulp.src(['js/**/*.js']))
      .pipe(concat('todo.min.js'))
      .pipe(uglify({preserveComments: 'some'}))
      .pipe(gulp.dest(build));
  });

  gulp.task('js', function () {
    gulp.src(['js/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(concat('todo.js'))
      .pipe(gulp.dest(build));
  });

  gulp.task('html', function () {
    gulp.src('templates/*.html')
      .pipe(minifyHtml())
      .pipe(gulp.dest(build));
  });

  gulp.task('css', function () {
    gulp.src('less/**/*.less')
      .pipe(less())
      .pipe(minifyCSS())
      .pipe(gulp.dest(build));
  });

  gulp.task('watch', function () {
    gulp.watch('js/**/*.js', ['js', 'min']);
    gulp.watch('templates/**/*.html', ['html']);
    gulp.watch('less/**/*.less', ['css']);
  });
}());