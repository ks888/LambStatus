import webpackConfig from '../build/webpack.config'
import configGen from '../config'

let config = configGen()

config.utils_paths.entry_point = config.utils_paths.client('admin.js')

config.utils_paths.dist = config.utils_paths.dist.bind(null, 'admin')

export default webpackConfig(config)
