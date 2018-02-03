import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: `${__dirname}/../../../.env`})

export default {
  entry: {
    GetComponents: [
      'babel-polyfill',
      './src/api/getComponents/index.js'
    ],
    PostComponents: [
      'babel-polyfill',
      './src/api/postComponents/index.js'
    ],
    PatchComponents: [
      'babel-polyfill',
      './src/api/patchComponents/index.js'
    ],
    DeleteComponents: [
      'babel-polyfill',
      './src/api/deleteComponents/index.js'
    ],
    GetIncidents: [
      'babel-polyfill',
      './src/api/getIncidents/index.js'
    ],
    GetIncident: [
      'babel-polyfill',
      './src/api/getIncident/index.js'
    ],
    PostIncidents: [
      'babel-polyfill',
      './src/api/postIncidents/index.js'
    ],
    PatchIncidents: [
      'babel-polyfill',
      './src/api/patchIncidents/index.js'
    ],
    DeleteIncidents: [
      'babel-polyfill',
      './src/api/deleteIncidents/index.js'
    ],
    PatchIncidentUpdates: [
      'babel-polyfill',
      './src/api/patchIncidentUpdates/index.js'
    ],
    GetMaintenances: [
      'babel-polyfill',
      './src/api/getMaintenances/index.js'
    ],
    GetMaintenanceUpdates: [
      'babel-polyfill',
      './src/api/getMaintenanceUpdates/index.js'
    ],
    PostMaintenances: [
      'babel-polyfill',
      './src/api/postMaintenances/index.js'
    ],
    PatchMaintenances: [
      'babel-polyfill',
      './src/api/patchMaintenances/index.js'
    ],
    DeleteMaintenances: [
      'babel-polyfill',
      './src/api/deleteMaintenances/index.js'
    ],
    PatchMaintenanceUpdates: [
      'babel-polyfill',
      './src/api/patchMaintenanceUpdates/index.js'
    ],
    CollectMetricsData: [
      'babel-polyfill',
      './src/api/collectMetricsData/index.js'
    ],
    GetExternalMetrics: [
      'babel-polyfill',
      './src/api/getExternalMetrics/index.js'
    ],
    GetPublicMetrics: [
      'babel-polyfill',
      './src/api/getPublicMetrics/index.js'
    ],
    GetMetrics: [
      'babel-polyfill',
      './src/api/getMetrics/index.js'
    ],
    PostMetrics: [
      'babel-polyfill',
      './src/api/postMetrics/index.js'
    ],
    PostMetricsData: [
      'babel-polyfill',
      './src/api/postMetricsData/index.js'
    ],
    PatchMetrics: [
      'babel-polyfill',
      './src/api/patchMetrics/index.js'
    ],
    DeleteMetrics: [
      'babel-polyfill',
      './src/api/deleteMetrics/index.js'
    ],
    S3PutObject: [
      'babel-polyfill',
      './src/api/s3PutObjects/index.js'
    ],
    S3SyncObjects: [
      'babel-polyfill',
      './src/api/s3SyncObjects/index.js'
    ],
    CognitoCreateUserPool: [
      'babel-polyfill',
      './src/api/cognitoCreateUserPool/index.js'
    ],
    CognitoCreateUserPoolClient: [
      'babel-polyfill',
      './src/api/cognitoCreateUserPoolClient/index.js'
    ],
    CognitoCreateUser: [
      'babel-polyfill',
      './src/api/cognitoCreateUser/index.js'
    ],
    APIGatewayDeploy: [
      'babel-polyfill',
      './src/api/apiGatewayDeploy/index.js'
    ],
    GetPublicSettings: [
      'babel-polyfill',
      './src/api/getPublicSettings/index.js'
    ],
    GetSettings: [
      'babel-polyfill',
      './src/api/getSettings/index.js'
    ],
    PatchSettings: [
      'babel-polyfill',
      './src/api/patchSettings/index.js'
    ],
    PostLogos: [
      'babel-polyfill',
      './src/api/postLogos/index.js'
    ],
    DeleteLogos: [
      'babel-polyfill',
      './src/api/deleteLogos/index.js'
    ],
    PostApiKeys: [
      'babel-polyfill',
      './src/api/postApiKeys/index.js'
    ],
    DeleteApiKeys: [
      'babel-polyfill',
      './src/api/deleteApiKeys/index.js'
    ],
    DBCreateItems: [
      'babel-polyfill',
      './src/api/dbCreateItems/index.js'
    ],
    UpdateFeeds: [
      'babel-polyfill',
      './src/api/updateFeeds/index.js'
    ],
    Subscribe: [
      'babel-polyfill',
      './src/api/subscribe/index.js'
    ],
    ConfirmSubscription: [
      'babel-polyfill',
      './src/api/confirmSubscription/index.js'
    ],
    Unsubscribe: [
      'babel-polyfill',
      './src/api/unsubscribe/index.js'
    ],
    GenerateVerificationMessage: [
      'babel-polyfill',
      './src/api/generateVerificationMessage/index.js'
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
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname, '../src')
  }
}
