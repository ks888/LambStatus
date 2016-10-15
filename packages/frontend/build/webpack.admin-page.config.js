import webpackConfig from '../build/webpack.config'
import configGen from '../config'

export let adminPageConfig = configGen()

adminPageConfig.utils_paths.entry_point = adminPageConfig.utils_paths.client('admin-page.js')

adminPageConfig.utils_paths.dist = adminPageConfig.utils_paths.dist.bind(null, 'admin-page')

export const webpackAdminPageConfig = webpackConfig(adminPageConfig)
