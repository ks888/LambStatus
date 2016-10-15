import fs from 'fs-extra'
import path from 'path'
import _debug from 'debug'
import webpackCompiler from '../build/webpack-compiler'
import { webpackAdminConfig } from '../build/webpack.admin.config'
import { webpackStatusPageConfig } from '../build/webpack.status-page.config'

const debug = _debug('app:bin:compile')

async function run (webpackConfig) {
  try {
    debug('Run compiler')
    const stats = await webpackCompiler(webpackConfig)
    if (stats.warnings.length && webpackConfig.compiler_fail_on_warning) {
      throw Error('Config set to fail on warning')
    }
    debug('Copy static assets to dist folder.')
    fs.copySync(path.resolve(webpackConfig.resolve.root, 'static'), webpackConfig.output.path)
  } catch (e) {
    throw e
  }
}

;(async function () {
  try {
    await run(webpackAdminConfig)
    await run(webpackStatusPageConfig)
  } catch (e) {
    debug('Compiler encountered an error.', e)
    process.exit(1)
  }
})()
