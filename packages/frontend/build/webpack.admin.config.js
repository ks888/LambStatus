import webpackConfig from '../build/webpack.config'
import config from '../config'

config.utils_paths.entry_point = config.utils_paths.client('admin.js')

config.utils_paths.dist = config.utils_paths.dist('admin')

export default webpackConfig(config)
