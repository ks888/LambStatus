import app from '../server/main'
import { adminPageConfig, webpackAdminPageConfig } from '../build/webpack.admin-page.config'
import { statusPageConfig, webpackStatusPageConfig } from '../build/webpack.status-page.config'

let adminApp = app(adminPageConfig, webpackAdminPageConfig)
let statusPageApp = app(statusPageConfig, webpackStatusPageConfig)

adminApp.listen()
statusPageApp.listen()
