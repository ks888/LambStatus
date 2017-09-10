import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import Visualizer from 'webpack-visualizer-plugin'
import _debug from 'debug'

const debug = _debug('app:webpack:config')

export default function (config) {
  const paths = config.utils_paths
  const {__DEV__, __PROD__, __TEST__, __COVERAGE__} = config.globals

  debug('Create configuration.')
  const webpackConfig = {
    name: 'client',
    target: 'web',
    devtool: config.compiler_devtool,
    resolve: {
      modules: [paths.client(), 'node_modules'],
      extensions: ['.js', '.jsx', '.json']
    },
    module: {}
    // devMiddlewareOptions: {  // TODO: temporal fix
    //   publicPath: config.compiler_public_path,
    //   quiet: config.compiler_quiet,
    //   noInfo: config.compiler_quiet,
    //   stats: config.compiler_stats
    // }
//    devPort: config.server_port  // TODO: temporal fix
  }
  // ------------------------------------
  // Entry Points
  // ------------------------------------
  const APP_ENTRY_PATHS = [
    paths.entry_point
  ]

  webpackConfig.entry = {
    app: __DEV__
      ? APP_ENTRY_PATHS.concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`)
      : APP_ENTRY_PATHS,
    vendor: config.compiler_vendor
  }

  // ------------------------------------
  // Bundle Output
  // ------------------------------------
  webpackConfig.output = {
    filename: `[name].[${config.compiler_hash_type}].js`,
    path: paths.dist(),
    publicPath: config.compiler_public_path
  }

  // ------------------------------------
  // Plugins
  // ------------------------------------
  webpackConfig.plugins = [
    new webpack.DefinePlugin(config.globals),
    new HtmlWebpackPlugin({
      template: paths.client('index.html'),
      hash: false,
      favicon: paths.client('static/favicon.ico'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true
      }
    }),
    new CopyWebpackPlugin([
      { from: 'config/settings.json' }
    ]),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new Visualizer()
  ]

  if (__DEV__) {
    debug('Enable plugins for live development (HMR, NoErrors).')
    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    )
  } else if (__PROD__) {
    debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          unused: true,
          dead_code: true,
          warnings: false
        }
      })
    )
  }

  // Don't split bundles during testing, since we only want import one bundle
  if (!__TEST__) {
    webpackConfig.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor']
      })
    )
  }

  // ------------------------------------
  // Rules
  // ------------------------------------
  // JavaScript
  const babelPresets = [['es2015', {modules: false}], 'react', 'stage-0']
  const babelPlugins = ['transform-runtime']
  if (__TEST__ && !__COVERAGE__) {
    // not work well with coverage setting
    babelPlugins.push('empower-assert')
    babelPlugins.push('espower')
  }

  webpackConfig.module.rules = [{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [{
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        plugins: babelPlugins,
        presets: babelPresets
      }
    }]
  }]

  // ------------------------------------
  // Style Loaders
  // ------------------------------------
  // We use cssnano with the postcss loader, so we tell
  // css-loader not to duplicate minimization.
  const BASE_CSS_LOADER = 'css-loader?sourceMap&-minimize'
  const POST_CSS_LOADER = {
    loader: 'postcss-loader',
    options: {
      config: {
        ctx: {
          cssnano: {
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions']
            },
            discardComments: {
              removeAll: true
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: true
          }
        }
      }
    }
  }
  const SASS_LOADER = {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      includePaths: paths.client('styles')
    }
  }

  // Add any packge names here whose styles need to be treated as CSS modules.
  // These paths will be combined into a single regex.
  const PATHS_TO_TREAT_AS_CSS_MODULES = [
  ]

  // If config has CSS modules enabled, treat this project's styles as CSS modules.
  if (config.compiler_css_modules) {
    PATHS_TO_TREAT_AS_CSS_MODULES.push(
      paths.client().replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&') // eslint-disable-line
    )
  }

  const isUsingCSSModules = !!PATHS_TO_TREAT_AS_CSS_MODULES.length
  const cssModulesRegex = new RegExp(`(${PATHS_TO_TREAT_AS_CSS_MODULES.join('|')})`)

  // Loaders for styles that need to be treated as CSS modules.
  if (isUsingCSSModules) {
    const cssModulesLoader = [
      BASE_CSS_LOADER,
      'modules',
      'importLoaders=1',
      'localIdentName=[name]__[local]___[hash:base64:5]'
    ].join('&')

    webpackConfig.module.rules.push({
      test: /\.scss$/,
      include: cssModulesRegex,
      exclude: /\.global\.scss$/,
      use: [
        'style-loader',
        cssModulesLoader,
        POST_CSS_LOADER,
        SASS_LOADER
      ]
    })

    webpackConfig.module.rules.push({
      test: /\.css$/,
      include: cssModulesRegex,
      exclude: /\.global\.css$/,
      use: [
        'style-loader',
        cssModulesLoader,
        POST_CSS_LOADER
      ]
    })
  }

  // Loaders for files that should not be treated as CSS modules.
  const excludeCSSModules = isUsingCSSModules ? cssModulesRegex : false
  webpackConfig.module.rules.push({
    test: /\.global\.scss$/,
    include: cssModulesRegex,
    use: [
      'style-loader',
      BASE_CSS_LOADER,
      POST_CSS_LOADER,
      SASS_LOADER
    ]
  })
  webpackConfig.module.rules.push({
    test: /\.global\.css$/,
    include: cssModulesRegex,
    use: [
      'style-loader',
      BASE_CSS_LOADER,
      POST_CSS_LOADER
    ]
  })
  webpackConfig.module.rules.push({
    test: /\.scss$/,
    exclude: excludeCSSModules,
    use: [
      'style-loader',
      BASE_CSS_LOADER,
      POST_CSS_LOADER,
      SASS_LOADER
    ]
  })
  webpackConfig.module.rules.push({
    test: /\.css$/,
    exclude: excludeCSSModules,
    use: [
      'style-loader',
      BASE_CSS_LOADER,
      POST_CSS_LOADER
    ]
  })

  // File loaders
  /* eslint-disable */
  webpackConfig.module.rules.push(
    { test: /\.woff(\?.*)?$/,  loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
    { test: /\.woff2(\?.*)?$/, loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
    { test: /\.otf(\?.*)?$/,   loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
    { test: /\.ttf(\?.*)?$/,   loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
    { test: /\.eot(\?.*)?$/,   loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]' },
    { test: /\.svg(\?.*)?$/,   loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
    { test: /\.(png|jpg)$/,    loader: 'url-loader?limit=8192' }
  )
  /* eslint-enable */

  // ------------------------------------
  // Finalize Configuration
  // ------------------------------------
  // when we don't know the public path (we know it only when HMR is enabled [in development]) we
  // need to use the extractTextPlugin to fix this issue:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  if (!__DEV__) {
    debug('Apply ExtractTextPlugin to CSS loaders.')
    webpackConfig.module.rules.filter(rule =>
      rule.loaders && rule.loaders.find((name) => /css/.test(name.split('?')[0]))
    ).forEach(rule => {
      const [first, ...rest] = rule.loaders
      rule.loader = ExtractTextPlugin.extract({
        fallback: first,
        use: rest.join('!')
      })
      Reflect.deleteProperty(rule, 'loaders')
    })

    webpackConfig.plugins.push(
      new ExtractTextPlugin({
        filename: '[name].[contenthash].css',
        allChunks: true
      })
    )
  }

  return webpackConfig
}
