module.exports = function(config) {
  config.set({
    basePath: './app/scripts',
    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    files: ['*.js'],
    reporters: ['spec']
    // ...
  });
};
