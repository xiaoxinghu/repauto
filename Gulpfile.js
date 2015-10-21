var source = require('vinyl-source-stream');
var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require("gulp-notify");
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');

var config = {
  css: {
    source: './ui/style/**/*.sass',
    dest: './public/stylesheets/'
  },
  js: {
    root: './ui',
    main: 'redux_app.js',
    dest: './public/javascripts/'
  }
}

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  // this.emit('end'); // Keep gulp from hanging on this task
}


// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function compileJS(watch) {
  var props = {
    entries: [config.js.root + '/' + config.js.main],
    debug: true,
    cache: {},
    extensions: ['.jsx', '.coffee', '.js'],
    packageCache: {},
    transform: [babelify.configure({optional: ['es7.exportExtensions', 'es7.decorators']}), reactify]
  };
  var bundler = watch ? watchify(browserify(props)) : browserify(props);
  // bundler.transform(reactify).transform(babel);
  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', handleErrors)
    .pipe(source(config.js.main))
    .pipe(gulp.dest(config.js.dest));
  }
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });
  return rebundle();
}


gulp.task('compile-js', function() {
  return compileJS(false);
});

gulp.task('compile-sass', function() {
  gulp.src(config.css.source)
      .pipe(sourcemaps.init())
      .pipe(sass({ indentedSyntax: true, errLogToConsole: true }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.css.dest));
});


gulp.task('watch-sass', function() {
  gulp.watch(config.css.source, ['compile-sass']);
});

gulp.task('watch-js', function() {
  compileJS(true);
});

gulp.task('watch', ['watch-sass', 'watch-js']);
gulp.task('default', ['compile-sass', 'compile-js']);
