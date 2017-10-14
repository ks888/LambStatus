import webpackConfig from '../build/webpack.config'
import configGen from '../config'

process.env.PORT = 3002
export let statusPageConfig = configGen()

statusPageConfig.utils_paths.entry_point = statusPageConfig.utils_paths.client('status-page.js')

statusPageConfig.utils_paths.dist = statusPageConfig.utils_paths.dist.bind(null, 'status-page')

statusPageConfig.compiler_alias = {
  'amazon-cognito-identity-js': 'empty-module'  // not necessary for status page, but its source size is fairly large.
}

export const webpackStatusPageConfig = webpackConfig(statusPageConfig)
