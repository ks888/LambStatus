import dotenv from 'dotenv'
import path from 'path'
import StringReplacePlugin from 'string-replace-webpack-plugin'

dotenv.config({path: `${__dirname}/../../../.env`})

export default {
  entry: {
    GetComponents: [
      'babel-polyfill',
      './src/getComponents/index.js'
    ],
    PostComponents: [
      'babel-polyfill',
      './src/postComponents/index.js'
    ],
    PatchComponents: [
      'babel-polyfill',
      './src/patchComponents/index.js'
    ],
    PatchIncidents: [
      'babel-polyfill',
      './src/patchIncidents/index.js'
    ],
    DeleteComponents: [
      'babel-polyfill',
      './src/deleteComponents/index.js'
    ],
    DeleteIncidents: [
      'babel-polyfill',
      './src/deleteIncidents/index.js'
    ],
    GetIncidents: [
      'babel-polyfill',
      './src/getIncidents/index.js'
    ],
    GetIncidentUpdates: [
      'babel-polyfill',
      './src/getIncidentUpdates/index.js'
    ],
    PostIncidents: [
      'babel-polyfill',
      './src/postIncidents/index.js'
    ],
    S3PutObject: [
      'babel-polyfill',
      './src/s3PutObjects/index.js'
    ],
    S3SyncObjects: [
      'babel-polyfill',
      './src/s3SyncObjects/index.js'
    ]
  },
  output: {
    path: './build/functions',
    library: '[name]',
    libraryTarget: 'commonjs2',
    filename: '[name]/index.js'
  },
  target: 'node',
  externals: { 'aws-sdk': 'commonjs aws-sdk' },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [ 'es2015', 'stage-0' ]
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /validate.js$/,
        include: /node_modules\/json-schema/,
        loader: StringReplacePlugin.replace({ // from the 'string-replace-webpack-plugin'
          replacements: [{
            pattern: /\(\{define:typeof define!="undefined"\?define:function\(deps, factory\)\{module\.exports = factory\(\);\}\}\)\./ig,
            replacement: function (match, p1, offset, string) {
              return false
            }
          }]
        })
      }
    ]
  },
  plugins: [
    new StringReplacePlugin()
  ],
  resolve: {
    root: path.resolve(__dirname, '../src')
  }
}
