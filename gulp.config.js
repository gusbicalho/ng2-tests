module.exports = function() {
  var tsconfig = require('./tsconfig.json');
  var temp = '.temp/'
  var src = 'src/';
  var config = {
    temp: temp,
    src: src,
    allts: [
      src + '**/*.ts'
    ],
    tsMain: src + 'scripts/app.ts',
    tsconfig: tsconfig,
    jsBundle: 'bundle.js',
    index: src + 'index.html',
    devServerPort: 7070,
    watchReload: [
      src + '**/*',
      temp + '**.*',
      '!' + src + '**/*.ts',
    ],
  };

  return config;
};
