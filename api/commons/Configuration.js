'use strict';

var fs = require('fs');
var _ = require('lodash');

var Configuration = {
  port: 10010,
  es: {
    host: 'localhost',
    port: 9200
  }
};


var loadCustomConf = function() {
  var confFilePath = process.env.CONF;
  if (confFilePath && fs.existsSync(confFilePath)) {
    console.log('Configuration file specified : ' + confFilePath)
    try {
      var confFileStats = fs.lstatSync(confFilePath);
      if (!confFileStats.isDirectory()) {
        var customConf = JSON.parse(fs.readFileSync(confFilePath, 'utf8'));
        Configuration = _.merge(Configuration, customConf);
        console.log('Custom configuration loaded.', customConf);
      }
    } catch (e) {
      console.log('ERROR ' + e);
    }
  }
}

loadCustomConf();

console.log('Final configuration' + JSON.stringify(Configuration, null, 4));

module.exports = Configuration;
