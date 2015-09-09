/*global require:true */
(function () {
  'use strict';

  var build = 'static/build/';

  var gulp = require('gulp');
  var uglify = require('gulp-uglify');
  var jshint = require('gulp-jshint');
  var concat = require('gulp-concat');
  var minifyHtml = require('gulp-minify-html');
  var minifyCSS = require('gulp-minify-css');
  var less = require('gulp-less');
  var arenitesrc = require('gulp-arenite-src');
  var server = require('gulp-server-livereload');

  gulp.task('default', ['html', 'css', 'js', 'min']);

  gulp.task('min', function () {
    arenitesrc({
        mode: 'dev', //Default is 'dev' anyway but left here for clarity
        base: 'static' //So you don't have to use the base folder directly
      },
      {
        export: 'arenite',
        imports: [
          {
            url: 'js/app.js',//The path defined here needs to be relative to here
            namespace: 'App'
          }
        ]
      }, function (src) {
        src
          .pipe(concat('todo.min.js'))
          .pipe(uglify({preserveComments: 'some'}))
          .pipe(gulp.dest(build));
      });
  });

  gulp.task('js', function () {
    gulp.src(['static/js/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(concat('todo.js'))
      .pipe(gulp.dest(build));
  });

  gulp.task('html', function () {
    gulp.src('static/templates/*.html')
      .pipe(minifyHtml())
      .pipe(gulp.dest(build));
  });

  gulp.task('css', function () {
    gulp.src('static/less/**/*.less')
      .pipe(less())
      .pipe(minifyCSS())
      .pipe(gulp.dest(build));
  });

  gulp.task('watch', function () {
    gulp.watch('static/js/**/*.js', ['js', 'min']);
    gulp.watch('static/templates/**/*.html', ['html']);
    gulp.watch('static/less/**/*.less', ['css']);
  });

  gulp.task('webserver', ['watch'], function () {
    gulp.src('static')
      .pipe(server({
        host: '192.168.1.13',
        livereload: true,
        directoryListing: true,
        open: false
      }));
  });

}());