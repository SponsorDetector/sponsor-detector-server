var webpack = require('webpack'),
  path = require('path'),
  env = require('common-env')(),
  fs = require('fs');

var configDir = path.join(__dirname, "/config"),
  apiDir = path.join(__dirname, "/api"),
  publicDir = path.join(__dirname, "/public");
var nodeModules = require('webpack-node-externals')();

module.exports = {
  entry: {
    app: ['./app.js', 'webpack-hot-middleware/client']
  },
  target: 'node',
  externals: nodeModules,
  plugins: [
    // Webpack 1.0
    new webpack.optimize.OccurenceOrderPlugin(),
    // Webpack 2.0 fixed this mispelling
    // new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.yaml$/,
      loader: 'style!css!sass',
    }]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  }
}
