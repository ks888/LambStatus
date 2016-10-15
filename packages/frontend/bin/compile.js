import fs from 'fs-extra'
import path from 'path'
import _debug from 'debug'
import webpackCompiler from '../build/webpack-compiler'
import webpackAdminConfig from '../build/webpack.admin.config'

const debug = _debug('app:bin:compile')

;(async function () {
  try {
    debug('Run compiler')
    const stats = await webpackCompiler(webpackAdminConfig)
    if (stats.warnings.length && webpackAdminConfig.compiler_fail_on_warning) {
      debug('Config set to fail on warning, exiting with status code "1".')
      process.exit(1)
    }
    debug('Copy static assets to dist folder.')
    fs.copySync(path.resolve(webpackAdminConfig.resolve.root, 'static'), webpackAdminConfig.output.path)
  } catch (e) {
    debug('Compiler encountered an error.', e)
    process.exit(1)
  }
})()
