import browserSync from 'browser-sync'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import historyApiFallback from 'connect-history-api-fallback'

import createSettingsJs from './utils/fetch-settings'
import { webpackAdminPageConfig } from '../build/webpack.admin-page.config'
import { webpackStatusPageConfig } from '../build/webpack.status-page.config'

const target = process.argv[2]

;(async () => {
  let config
  if (target === 'admin') {
    config = webpackAdminPageConfig
    await createSettingsJs(true)
  } else if (target === 'status') {
    config = webpackStatusPageConfig
    await createSettingsJs(false)
  }

  const bundler = webpack(config)
  browserSync.create().init({
    server: {
      baseDir: 'server/static'
    },
    middleware: [
      historyApiFallback(),
      webpackDevMiddleware(bundler, config.devMiddlewareOptions),
      webpackHotMiddleware(bundler)
    ],
    files: [
      'server/static/*'
    ],
    port: config.devPort,
    ui: {
      port: Number(config.devPort) + 1
    },
    socket: {
      domain: `localhost:${config.devPort}`
    }
  })
})()

