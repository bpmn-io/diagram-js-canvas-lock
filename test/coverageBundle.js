import './globals.js';

const allTests = import.meta.webpackContext('.', {
  recursive: true,
  regExp: /\.spec\.js$/
});

allTests.keys().forEach(allTests);

const allSources = import.meta.webpackContext('../lib', {
  recursive: true,
  regExp: /.*\.js$/
});

allSources.keys().forEach(allSources);
