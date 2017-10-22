import fs from 'fs-extra'
import path from 'path'
import _debug from 'debug'
import createSettingsJs from './utils/fetch-settings'
import webpackCompiler from '../build/webpack-compiler'
import { webpackAdminPageConfig } from '../build/webpack.admin-page.config'
import { webpackStatusPageConfig } from '../build/webpack.status-page.config'

const debug = _debug('app:bin:compile')

const run = async (isAdminPage) => {
  try {
    debug('Create settings.js')
    await createSettingsJs(isAdminPage)

    debug('Run compiler')
    let webpackConfig
    if (isAdminPage) {
      webpackConfig = webpackAdminPageConfig
    } else {
      webpackConfig = webpackStatusPageConfig
    }
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
    await run(true)
    await run(false)
  } catch (e) {
    debug('Compiler encountered an error.', e)
    process.exit(1)
  }
})()
