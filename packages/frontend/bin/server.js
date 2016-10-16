import app from '../server/main'
import { adminPageConfig, webpackAdminPageConfig } from '../build/webpack.admin-page.config'
import { statusPageConfig, webpackStatusPageConfig } from '../build/webpack.status-page.config'

const target = process.argv[2]
if (target === 'admin' || target === undefined) {
  let adminApp = app(adminPageConfig, webpackAdminPageConfig)
  adminApp.listen()
}

if (target === 'status' || target === undefined) {
  let statusPageApp = app(statusPageConfig, webpackStatusPageConfig)
  statusPageApp.listen()
}
