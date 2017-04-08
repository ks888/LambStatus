// ---------------------------------------
// Test Environment Setup
// ---------------------------------------
import 'babel-polyfill'
import sinon from 'sinon'
import assert from 'assert'
import * as settings from 'utils/settings'

global.sinon = sinon
global.assert = assert
global.console.error = () => {}
settings.apiURL = '/'
settings.serviceName = ''
settings.statusPageURL = ''
settings.userPoolId = 'ap-northeast-1_XXXXXXXXX'
settings.clientId = 'test'

// ---------------------------------------
// Require Tests
// ---------------------------------------
// for use with karma-webpack-with-fast-source-maps
const __karmaWebpackManifest__ = new Array() // eslint-disable-line
const inManifest = (path) => ~__karmaWebpackManifest__.indexOf(path)

// require all `tests/**/*.spec.js`
const testsContext = require.context('./', true, /\.spec\.js$/)

// only run tests that have changed after the first pass.
const testsToRun = testsContext.keys().filter(inManifest)
;(testsToRun.length ? testsToRun : testsContext.keys()).forEach(testsContext)

// require all `src/**/*.js` except for `main.js` (for isparta coverage reporting)
if (__COVERAGE__) {
  const componentsContext = require.context('../src/', true, /^((?!main).)*\.js$/)
  componentsContext.keys().filter((v) => {
    console.log(v)
    return v !== './admin-page.js' && v !== './status-page.js'
  }).forEach(componentsContext)
}
