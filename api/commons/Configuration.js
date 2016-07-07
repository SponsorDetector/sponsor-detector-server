'use strict';

var fs = require('fs');
var _ = require('lodash');

var Configuration = {
  port: 10010,
  es: {
    host: 'localhost',
    port: 9200
  },
  configuration: {
    type : "configuration"
  },
  stats : {
    type : "stats"
  }
};

var loadCustomConf = function() {
  var conf = {};
  var confFilePath = process.env.CONF;
  if (confFilePath && fs.existsSync(confFilePath)) {
    console.log('Configuration file specified : ' + confFilePath)
    try {
      var confFileStats = fs.lstatSync(confFilePath);
      if (!confFileStats.isDirectory()) {
        conf = JSON.parse(fs.readFileSync(confFilePath, 'utf8'));
        console.log('Custom configuration loaded.', customConf);
      }
    } catch (e) {
      console.log('ERROR ' + e);
    }
  }
  return conf;
}

Configuration = _.merge(Configuration, loadCustomConf());

console.log('Final configuration' + JSON.stringify(Configuration, null, 4));

module.exports = Configuration;
