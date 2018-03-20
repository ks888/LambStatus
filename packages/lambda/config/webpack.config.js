const dotenv = require('dotenv')
const path = require('path')

dotenv.config({path: `${__dirname}/../../../.env`})

module.exports = {
  entry: {
    GetStatus: './src/api/getStatus/index.js',
    GetComponents: './src/api/getComponents/index.js',
    PostComponents: './src/api/postComponents/index.js',
    PatchComponents: './src/api/patchComponents/index.js',
    DeleteComponents: './src/api/deleteComponents/index.js',
    GetIncidents: './src/api/getIncidents/index.js',
    GetIncident: './src/api/getIncident/index.js',
    PostIncidents: './src/api/postIncidents/index.js',
    PatchIncidents: './src/api/patchIncidents/index.js',
    DeleteIncidents: './src/api/deleteIncidents/index.js',
    PatchIncidentUpdates: './src/api/patchIncidentUpdates/index.js',
    GetMaintenances: './src/api/getMaintenances/index.js',
    GetMaintenanceUpdates: './src/api/getMaintenanceUpdates/index.js',
    PostMaintenances: './src/api/postMaintenances/index.js',
    PatchMaintenances: './src/api/patchMaintenances/index.js',
    DeleteMaintenances: './src/api/deleteMaintenances/index.js',
    PatchMaintenanceUpdates: './src/api/patchMaintenanceUpdates/index.js',
    CollectMetricsData: './src/api/collectMetricsData/index.js',
    GetExternalMetrics: './src/api/getExternalMetrics/index.js',
    GetPublicMetrics: './src/api/getPublicMetrics/index.js',
    GetMetrics: './src/api/getMetrics/index.js',
    PostMetrics: './src/api/postMetrics/index.js',
    PostMetricsData: './src/api/postMetricsData/index.js',
    PatchMetrics: './src/api/patchMetrics/index.js',
    DeleteMetrics: './src/api/deleteMetrics/index.js',
    S3PutObject: './src/api/s3PutObjects/index.js',
    S3SyncObjects: './src/api/s3SyncObjects/index.js',
    CognitoCreateUserPool: './src/api/cognitoCreateUserPool/index.js',
    CognitoCreateUserPoolClient: './src/api/cognitoCreateUserPoolClient/index.js',
    CognitoCreateUser: './src/api/cognitoCreateUser/index.js',
    APIGatewayDeploy: './src/api/apiGatewayDeploy/index.js',
    GetPublicSettings: './src/api/getPublicSettings/index.js',
    GetSettings: './src/api/getSettings/index.js',
    PatchSettings: './src/api/patchSettings/index.js',
    PostLogos: './src/api/postLogos/index.js',
    DeleteLogos: './src/api/deleteLogos/index.js',
    PostApiKeys: './src/api/postApiKeys/index.js',
    DeleteApiKeys: './src/api/deleteApiKeys/index.js',
    DBCreateItems: './src/api/dbCreateItems/index.js',
    UpdateFeeds: './src/api/updateFeeds/index.js',
    SendEmails: './src/api/sendEmails/index.js',
    Subscribe: './src/api/subscribe/index.js',
    ConfirmSubscription: './src/api/confirmSubscription/index.js',
    Unsubscribe: './src/api/unsubscribe/index.js',
    GenerateVerificationMessage: './src/api/generateVerificationMessage/index.js',
    HandleBouncesAndComplaints: './src/api/handleBouncesAndComplaints/index.js'
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
        loader: 'babel'
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
