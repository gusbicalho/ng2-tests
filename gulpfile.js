var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var $ = require('gulp-load-plugins')();

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

gulp.task('tsc', function() {
  return gulp
    .src(config.allts)
    .pipe($.typescript(tsProject))
    .js
    .pipe(gulp.dest(config.jsDest))
});

gulp.task('dev-tslint-watcher', function() {
    var linted = {};
    function checkLinted(vinylFile) {
      return linted[vinylFile.path] || !(linted[vinylFile.path] = true);
    }
    function notice(path) {
      return "TSLint: " + path;
    }
    return gulp
        .src(config.allts)
        .pipe($.plumber())
        .pipe($.watch(config.allts))
        .pipe($.if(true, $.print(notice)))
        .pipe($.tslint())
        .pipe($.tslint.report($.tslintStylish, {
          emitError: false,
          sort: true,
          bell: true
        }));
});

gulp.task('dev-tsc-watcher', ['tsc'], function() {
    gulp.watch([config.allts], ['tsc']);
});

gulp.task('dev-serve', function() {
  var express = require('express');
  var server = express();
  var port = args.port || config.devServerPort;
  
  server.use(express.static(config.jsDest));
  server.use(express.static(config.src));
  server.use('/node_modules/', express.static(config.servedModules));
  
  server.all('/*', function(req, res) {
    console.log('Sending index.html for url:', req.url);
    res.sendFile('/index.html', { root: config.clientDir });
  });
  
  console.log('*** Serving CLIENT on port ' + port);
  
  server.listen(port);
});

gulp.task('dev', ['dev-tslint-watcher', 'dev-tsc-watcher', 'dev-serve']);

///////////////////////////////////////

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path)
      .then(
        function(paths) { done(null, paths); },
        function(err) { done(err); });
}

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
