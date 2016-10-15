import app from '../server/main'
import { adminConfig, webpackAdminConfig } from '../build/webpack.admin.config'
import { statusPageConfig, webpackStatusPageConfig } from '../build/webpack.status-page.config'

let adminApp = app(adminConfig, webpackAdminConfig)
let statusPageApp = app(statusPageConfig, webpackStatusPageConfig)

adminApp.listen()
statusPageApp.listen()
