module.exports = {
  admin: (config) => {
    config.server_port = 3000
    config.utils_paths.entry_point = config.utils_paths.client('admin-page.js')
    config.utils_paths.dist = config.utils_paths.dist.bind(null, 'admin-page')
  },

  status: (config) => {
    config.server_port = 3002
    config.utils_paths.entry_point = config.utils_paths.client('status-page.js')
    config.utils_paths.dist = config.utils_paths.dist.bind(null, 'status-page')
    config.compiler_alias = {
      // not necessary for status page, but its source size is fairly large. So remove it.
      'amazon-cognito-identity-js': 'empty-module'
    }
  }
}
