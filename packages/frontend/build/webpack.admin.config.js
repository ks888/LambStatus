import webpackConfig from '../build/webpack.config'
import configGen from '../config'

export let adminConfig = configGen()

adminConfig.utils_paths.entry_point = adminConfig.utils_paths.client('admin.js')

adminConfig.utils_paths.dist = adminConfig.utils_paths.dist.bind(null, 'admin')

export const webpackAdminConfig = webpackConfig(adminConfig)
