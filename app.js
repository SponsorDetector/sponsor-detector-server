'use strict';
var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) {
    throw err;
  }
  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port, function() {
    console.log('now running on port', port);
  });
});

if (process.env.mode === "dev") {
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config.js");

  var compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use('/swagger/api', require('express').static('./resources/swagger.yaml'));
app.use('/swagger', require('express').static('./node_modules/swagger-ui/dist'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
