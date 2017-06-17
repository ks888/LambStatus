// ---------------------------------------
// Test Environment Setup
// ---------------------------------------
import 'babel-polyfill'
import sinon from 'sinon'
import assert from 'assert'
import * as settings from 'utils/settings'

global.sinon = sinon
global.assert = assert
global.componentHandler = { upgradeElement: () => {} }
global.buildEmptyStore = (state) => {
  return {
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => { return { ...state } }
  }
}
settings.apiURL = 'https://XXXXXXXXXX.execute-api.ap-northeast-1.amazonaws.com/prod/'
settings.userPoolId = 'ap-northeast-1_XXXXXXXXX'
settings.clientId = 'test'

// ---------------------------------------
// Require Tests
// ---------------------------------------
// https://www.npmjs.com/package/karma-webpack-with-fast-source-maps

// This gets replaced by karma webpack with the updated files on rebuild
const __karmaWebpackManifest__ = new Array()  // eslint-disable-line no-array-constructor
const inManifest = path => { return __karmaWebpackManifest__.indexOf(path) >= 0 }

// require all `tests/**/*.spec.js`
const testsContext = require.context('./', true, /\.spec\.js$/)

// only run tests that have changed after the first pass.
let testsToRun = testsContext.keys().filter(inManifest)
if (!testsToRun.length) {
  testsToRun = testsContext.keys()
}
testsToRun.forEach(testsContext)

// require all `src/**/*.js` except for `main.js` (for isparta coverage reporting)
if (__COVERAGE__) {
  const componentsContext = require.context('../src/', true, /^((?!main).)*\.js$/)
  componentsContext.keys().filter((v) => {
    return v !== './admin-page.js' && v !== './status-page.js'
  }).forEach(componentsContext)
}
