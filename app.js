'use strict';

var SwaggerExpress = require('swagger-express-middleware');
var app = require('express')();
module.exports = app; // for testing

var config = './resources/swagger.yaml';

SwaggerExpress(config, app, function(err, swaggerExpress) {
  if (err) {
    throw err;
  }

  var port = process.env.PORT || 10010;
  app.listen(port, function() {
    console.log('now running on port', port);

  });
});

app.use('/swagger/api', require('express').static('./resources/swagger.yaml'));
app.use('/swagger', require('express').static('./swaggerui'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
