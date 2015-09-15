module.exports = function() {
  var tsconfig = require('./tsconfig.json');
  var config = {
    src: 'src',
    jsDest: tsconfig.compilerOptions.outDir,
    allts: [
      'src/ts/**/*.ts'
    ],
    index: 'src/index.html',
    devServerPort: 7070,
    servedModules: 'node_modules',
  };

  return config;
};
