import fs from 'fs-extra'
import path from 'path'
import _debug from 'debug'
import webpackCompiler from '../build/webpack-compiler'
import webpackConfig from '../build/webpack.config'

const debug = _debug('app:bin:compile')

;(async function () {
  try {
    await webpackCompiler(webpackConfig)
    fs.copySync(path.resolve(webpackConfig.resolve.root, 'static'), webpackConfig.output.path)
  } catch (e) {
    debug('Compiler encountered an error.', e)
    process.exit(1)
  }
})()
