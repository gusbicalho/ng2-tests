var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

var tsProject = $.typescript.createProject('tsconfig.json');

gulp.task('default', $.taskListing);

gulp.task('tslint', function() {
    log('Analyzing source with TSLint');
    return gulp
        .src(config.allts)
        .pipe($.plumber())
        .pipe($.tslint())
        .pipe($.tslint.report($.tslintStylish, {
          emitError: false,
          sort: true,
          bell: false
        }));
});

gulp.task('dev-watch-tslint', function() {
  log('Watching source with TSLint');
  function notice(path) {
    return "TSLint: " + path;
  }
  return gulp
      .src(config.allts)
      .pipe($.plumber())
      .pipe($.watch(config.allts))
      .pipe($.print(notice))
      .pipe($.tslint())
      .pipe($.tslint.report($.tslintStylish, {
        emitError: false,
        sort: true,
        bell: true
      }));
});

gulp.task('dev-watchify', function() {
  log('Watching and building with watchify');
  var bundler = watchify(browserify(config.tsMain, watchify.args));
  bundler.plugin('tsify', config.tsconfig);
  bundler.on('update', watchifyBundle); // on any dep update, runs the bundler
  bundler.on('log', log); // output build logs to terminal

  return watchifyBundle();

  function watchifyBundle() {
    return bundler.bundle()
      .on('error', $.util.log.bind($.util, 'Browserify Error'))
      .pipe(source(config.jsBundle))
      .pipe(gulp.dest(config.temp));
  }
});

gulp.task('dev-serve', function() {
  log('Serving src and temp');
  var port = args.port || config.devServerPort;
  $.connect.server({
    root: [config.temp, config.src],
    fallback: config.index,
    port: port,
    livereload: true
  });
  gulp.watch(config.watchReload, function() {
    return gulp.src(config.watchReload, {read: false})
            .pipe($.connect.reload());
  })
});

gulp.task('dev', ['dev-watch-tslint', 'dev-watchify', 'dev-serve']);

///////////////////////////////////////

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
