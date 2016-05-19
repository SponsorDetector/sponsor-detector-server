var webpack = require('webpack'),
  path = require('path'),
  env = require('common-env')(),
  fs = require('fs');

var nodeModules = require('webpack-node-externals')();

var outputDir = 'webpack';

module.exports = {
  name: 'appServer',
  entry: {
    app: ['./app.js']
  },
  target: 'node',
  node: {
    __dirname: false
  },
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
      test: /\.js$/,
      exclude: './node_modules',
      loader: 'babel'
    }]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  }
}
