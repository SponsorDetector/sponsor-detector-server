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
    server: ['./app.js', './api/controllers/elasticsearch.js']
  },
  target: 'node',
  externals: nodeModules,
  plugins: [
    //  new webpack.HotModuleReplacementPlugin()
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
