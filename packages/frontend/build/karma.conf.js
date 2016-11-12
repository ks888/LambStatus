import { argv } from 'yargs'
// import webpackConfig from './webpack.config'
import { adminPageConfig, webpackAdminPageConfig } from './webpack.admin-page.config'
import _debug from 'debug'

const debug = _debug('app:karma')
debug('Create configuration.')

const karmaConfig = {
  basePath: '../',
  files: [
    {
      pattern: `./${adminPageConfig.dir_test}/test-bundler.js`,
      watched: false,
      served: true,
      included: true
    }
  ],
  singleRun: !argv.watch,
  frameworks: ['mocha'],
  reporters: ['mocha'],
  preprocessors: {
    [`${adminPageConfig.dir_test}/test-bundler.js`]: ['webpack']
  },
  browsers: ['PhantomJS'],
  customLaunchers: {
    'PhantomJS_custom': {
      base: 'PhantomJS',
      options: {
        windowName: 'test-window',
        settings: {
          webSecurityEnabled: false
        }
      },
      flags: ['--load-images=true', '--debug=yes'],
      debug: true
    }
  },
  webpack: {
    devtool: 'cheap-module-source-map',
    resolve: {
      ...webpackAdminPageConfig.resolve,
      alias: {
        ...webpackAdminPageConfig.resolve.alias,
        sinon: 'sinon/pkg/sinon.js'
      }
    },
    plugins: webpackAdminPageConfig.plugins,
    module: {
      noParse: [
        /\/sinon\.js/
      ],
      loaders: webpackAdminPageConfig.module.loaders.concat([
        {
          test: /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
          loader: 'imports?define=>false,require=>false'
        }
      ])
    },
    // Enzyme fix, see:
    // https://github.com/airbnb/enzyme/issues/47
    externals: {
      ...webpackAdminPageConfig.externals,
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window'
    },
    sassLoader: webpackAdminPageConfig.sassLoader
  },
  webpackMiddleware: {
    noInfo: true
  },
  coverageReporter: {
    reporters: adminPageConfig.coverage_reporters
  }
}

if (adminPageConfig.globals.__COVERAGE__) {
  karmaConfig.reporters.push('coverage')
  karmaConfig.webpack.module.preLoaders = [{
    test: /\.(js|jsx)$/,
    include: new RegExp(adminPageConfig.dir_client),
    loader: 'isparta',
    exclude: /node_modules/
  }]
}

// cannot use `export default` because of Karma.
module.exports = (cfg) => cfg.set(karmaConfig)
