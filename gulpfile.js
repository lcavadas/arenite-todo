/*global require:true */
(function () {
  'use strict';

  var build = 'build/';

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
    arenitesrc('dev', {
      export: 'arenite',
      imports: [
        {
          url: 'js/app.js',
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

  gulp.task('webserver', function() {
    gulp.src('.')
      .pipe(server({
        livereload: true,
        directoryListing: true,
        open: true
      }));
  });

}());