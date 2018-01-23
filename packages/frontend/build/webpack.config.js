const webpack = require('webpack')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const _debug = require('debug')
const { buildScriptURL, buildCSSURL } = require('./cdn')

const debug = _debug('app:webpack:config')

// These modules are served from cdnjs.
// 'moduleName' and 'dependedBy' are used to resolve the module version.
// 'libraryName', 'cssPath' and 'scriptPath' are used to build the cdn url.
// If defined, 'external' is used to build the 'externals' option of webpack.
/* eslint-disable max-len */
const modulesServedFromCDN = [
  {moduleName: 'c3', dependedBy: [], libraryName: 'c3', cssPath: 'c3.css', scriptPath: 'c3.js', external: 'c3'},
  {moduleName: 'd3', dependedBy: ['c3'], libraryName: 'd3', scriptPath: 'd3.js'},
  {moduleName: 'react', dependedBy: [], libraryName: 'react', scriptPath: 'react.js', external: 'React'},
  {moduleName: 'react-dom', dependedBy: [], libraryName: 'react-dom', scriptPath: 'react-dom.js', external: 'ReactDOM'},
  {moduleName: 'react-router', dependedBy: [], libraryName: 'react-router', scriptPath: 'ReactRouter.js', external: 'ReactRouter'},
  {moduleName: 'moment', dependedBy: ['moment-timezone'], libraryName: 'moment.js', scriptPath: 'moment.js'},
  {moduleName: 'moment-timezone', dependedBy: [], libraryName: 'moment-timezone', scriptPath: 'moment-timezone-with-data.js', external: 'moment'}
]
/* eslint-enable max-len */

const cssServedFromCDN = modulesServedFromCDN.reduce(function (prev, curr) {
  if (curr.cssPath !== undefined) prev.push(buildCSSURL(curr))
  return prev
}, [])

const scriptsServedFromCDN = modulesServedFromCDN.reduce(function (prev, curr) {
  if (curr.scriptPath !== undefined) prev.push(buildScriptURL(curr))
  return prev
}, [])

const generateWebpackConfig = (config) => {
  const paths = config.utils_paths
  const {__DEV__, __PROD__, __TEST__, __COVERAGE__} = config.globals

  debug('Create configuration.')
  const webpackConfig = {
    name: 'client',
    target: 'web',
    devtool: config.compiler_devtool,
    resolve: {
      root: paths.client(),
      extensions: ['', '.js', '.jsx', '.json'],
      alias: config.compiler_alias
    },
    module: {},
    devServer: {
      contentBase: paths.dist(),
      historyApiFallback: true,
      inline: true,
      port: config.server_port
    },
    entry: {
      app: [paths.entry_point]
    },
    output: {
      filename: `[name].[${config.compiler_hash_type}].js`,
      path: paths.dist(),
      publicPath: '/'
    }
  }

  if (!__TEST__) {
    webpackConfig.externals = modulesServedFromCDN.reduce(function (prev, curr) {
      if (curr.external !== undefined) prev[curr.moduleName] = curr.external
      return prev
    }, {})
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
      },
      stylesheets: cssServedFromCDN,
      scripts: scriptsServedFromCDN
    }),
    new CopyWebpackPlugin([
      { from: config.settings_js_path, to: 'settings.js' }
    ])
  ]

  if (__PROD__) {
    debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
    webpackConfig.plugins.push(
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false
        }
      })
    )
  }

  // ------------------------------------
  // Pre-Loaders
  // ------------------------------------
  /*
  [ NOTE ]
  We no longer use eslint-loader due to it severely impacting build
  times for larger projects. `npm run lint` still exists to aid in
  deploy processes (such as with CI), and it's recommended that you
  use a linting plugin for your IDE in place of this loader.

  If you do wish to continue using the loader, you can uncomment
  the code below and run `npm i --save-dev eslint-loader`. This code
  will be removed in a future release.

  webpackConfig.module.preLoaders = [{
    test: /\.(js|jsx)$/,
    loader: 'eslint',
    exclude: /node_modules/
  }]

  webpackConfig.eslint = {
    configFile: paths.base('.eslintrc'),
    emitWarning: __DEV__
  }
  */

  // ------------------------------------
  // Loaders
  // ------------------------------------
  // JavaScript / JSON
  const babelPresets = ['es2015', 'react', 'stage-0']
  const babelPlugins = ['transform-runtime']
  if (__TEST__ && !__COVERAGE__) {
    // not work well with coverage setting
    babelPlugins.push('empower-assert')
    babelPlugins.push('espower')
  }

  webpackConfig.module.loaders = [{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      cacheDirectory: true,
      plugins: babelPlugins,
      presets: babelPresets
    }
  },
  {
    test: /\.json$/,
    loader: 'json'
  }]

  // ------------------------------------
  // Style Loaders
  // ------------------------------------
  // We use cssnano with the postcss loader, so we tell
  // css-loader not to duplicate minimization.
  const BASE_CSS_LOADER = 'css?sourceMap&-minimize'

  // Add any packge names here whose styles need to be treated as CSS modules.
  // These paths will be combined into a single regex.
  const PATHS_TO_TREAT_AS_CSS_MODULES = [
  ]

  PATHS_TO_TREAT_AS_CSS_MODULES.push(
    paths.client().replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&') // eslint-disable-line
  )

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

    webpackConfig.module.loaders.push({
      test: /\.scss$/,
      include: cssModulesRegex,
      exclude: /\.global\.scss$/,
      loaders: [
        'style',
        cssModulesLoader,
        'postcss',
        'sass?sourceMap'
      ]
    })

    webpackConfig.module.loaders.push({
      test: /\.css$/,
      include: cssModulesRegex,
      exclude: /\.global\.css$/,
      loaders: [
        'style',
        cssModulesLoader,
        'postcss'
      ]
    })
  }

  // Loaders for files that should not be treated as CSS modules.
  const excludeCSSModules = isUsingCSSModules ? cssModulesRegex : false
  webpackConfig.module.loaders.push({
    test: /\.global\.scss$/,
    include: cssModulesRegex,
    loaders: [
      'style',
      BASE_CSS_LOADER,
      'postcss',
      'sass?sourceMap'
    ]
  })
  webpackConfig.module.loaders.push({
    test: /\.global\.css$/,
    include: cssModulesRegex,
    loaders: [
      'style',
      BASE_CSS_LOADER,
      'postcss'
    ]
  })
  webpackConfig.module.loaders.push({
    test: /\.scss$/,
    exclude: excludeCSSModules,
    loaders: [
      'style',
      BASE_CSS_LOADER,
      'postcss',
      'sass?sourceMap'
    ]
  })
  webpackConfig.module.loaders.push({
    test: /\.css$/,
    exclude: excludeCSSModules,
    loaders: [
      'style',
      BASE_CSS_LOADER,
      'postcss'
    ]
  })

  // ------------------------------------
  // Style Configuration
  // ------------------------------------
  webpackConfig.sassLoader = {
    includePaths: paths.client('styles')
  }

  webpackConfig.postcss = [
    cssnano({
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
    })
  ]

  // File loaders
  /* eslint-disable */
  webpackConfig.module.loaders.push(
    { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
    { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
    { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
    { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
    { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
    { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
    { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
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
    webpackConfig.module.loaders.filter((loader) =>
      loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
    ).forEach((loader) => {
      const [first, ...rest] = loader.loaders
      loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
      Reflect.deleteProperty(loader, 'loaders')
    })

    webpackConfig.plugins.push(
      new ExtractTextPlugin('[name].[contenthash].css', {
        allChunks: true
      })
    )
  }

  return webpackConfig
}

const settings = require('../config')
module.exports = generateWebpackConfig(settings)
