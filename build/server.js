/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(4);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var SwaggerExpress = __webpack_require__(2);
	var app = __webpack_require__(3)();
	module.exports = app; // for testing

	var config = {
	  appRoot: __dirname // required config
	};

	SwaggerExpress.create(config, function(err, swaggerExpress) {
	  if (err) {
	    throw err;
	  }

	  // install middleware
	  swaggerExpress.register(app);

	  var port = process.env.PORT || 10010;
	  app.listen(port);

	  if (swaggerExpress.runner.swagger.paths['/hello']) {
	    console.log('try this:\ncurl http://127.0.0.1:' + port +
	      '/hello?name=Scott');
	  }
	});

	app.use('/swagger/api', __webpack_require__(3).static('./api/swagger/swagger.yaml'));
	app.use('/swagger', __webpack_require__(3).static('./node_modules/swagger-ui/dist'));
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers",
	    "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});

	app.post('/', function(req, res, next) {
	  console.log("blblbl")
	});

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("swagger-express-mw");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var elasticsearch = __webpack_require__(5);

	var elasticClient = new elasticsearch.Client({
	    host: 'localhost:9200',
	    log: 'trace'

	});

	var configuration = "configurationIndex";
	var sponsoredContent = "sponsoredContentIndex";

	/**
	* Delete an existing configuration index
	*/
	function deleteConfigurationIndex() {
	    return elasticClient.indices.delete({
	        index: configuration
	    });
	}
	exports.deleteConfigurationIndex = deleteConfigurationIndex;

	/**
	* create the configuration index
	*/
	function initConfigurationIndex() {
	    return elasticClient.indices.create({
	        index: configuration
	    });
	}
	exports.initConfigurationIndex = initConfigurationIndex;

	/**
	* check if the configuration index exists
	*/
	function indexConfigurationExists() {
	    return elasticClient.indices.exists({
	        index: configuration
	    });
	}
	exports.indexConfigurationExists = indexConfigurationExists;

	/**
	* create the sponsoredContent index
	*/
	function initSponsoredContentIndex() {
	    return elasticClient.indices.create({
	        index: sponsoredContent
	    });
	}
	exports.initSponsoredContentIndex = initSponsoredContentIndex;

	/**
	* check if the sponsoredContent index exists
	*/
	function indexSponsoredContentExists() {
	    return elasticClient.indices.exists({
	        index: sponsoredContent
	    });
	}
	exports.indexSponsoredContentExists = indexSponsoredContentExists;

	/**
	* Delete an existing sponsoredContent index
	*/
	function deleteSponsoredContentIndex() {
	    return elasticClient.indices.delete({
	        index: sponsoredContent
	    });
	}
	exports.deleteSponsoredContentIndex = deleteSponsoredContentIndex;

	function initMapping() {
	    return elasticClient.indices.putMapping(
	      {
	        index: configuration,
	        type: "configuration",
	        body: 
	        {
	          dynamic_templates : [
	              {
	                string_fields: {
	                  match: "*",
	                  match_mapping_type: "string",
	                  mapping: {
	                    index: "not_analyzed",
	                    omit_norms: true,
	                    type: "string"
	                  }
	                }
	              }
	            ],
	        properties: {
	          pushed_at: {
	            type: "date",
	            format : "yyyy-MM-dd HH:mm"
	          }
	        }
	      }
	    },
	  {
	    index: sponsoredContent,
	    type: "sponsoredContent",
	    body:{
	      dynamic_templates: [
	          {
	            string_fields: {
	              match: "*",
	              match_mapping_type: "string",
	              mapping: {
	                index: "not_analyzed",
	                omit_norms: true,
	                type: "string"
	              }
	            }
	          }
	        ],
	    properties: {
	      pushed_at: {
	        type: "date",
	        format : "yyyy-MM-dd HH:mm"
	      }
	    }
	  }
	});
	}
	exports.initMapping = initMapping;

	function addConfiguration(req, res) {
	   var configuration = req.body
	    elasticClient.index({
	        index: "configuration",
	        type: "configuration",
	        body: {
	            domain: configuration.domain,
	            name: configuration.name,
	            author: {
	                extractor: {
	                  name : configuration.author.extractor.name,
	                  params : configuration.author.extractor.params
	                }
	            },
	            sponsor: {
	                detector: {
	                  name : configuration.sponsor.detector.name,
	                  params : configuration.sponsor.detector.params
	                },
	                extractor: {
	                  name : configuration.sponsor.extractor.name,
	                  params : configuration.sponsor.extractor.params
	                }
	            },
	            status : configuration.status
	        }
	    });
	    res.status(201);
	    res.send(configuration) ;
	}
	exports.addConfiguration = addConfiguration;

	function getAllConfiguration(req, res) {
	    elasticClient.search({
	        index: "configuration",
	        type: "configuration",
	        body: {
	          query: {
	            match_all: {}
	          }
	        }
	    }).then(function (resp) {
	      var hits = resp.hits.hits;
	      res.send(hits);
	    });
	}
	exports.getAllConfiguration = getAllConfiguration;

	function getAllConfigurationByDomain(req, res) {
	    console.log("blblblblbllbl")
	    return elasticClient.get({
	        index: "configuration",
	        type: "configuration",
	        body: {
	          query: {
	            multi_match: {
	              query: 'express js',
	              fields: ['domainName']
	            }
	          }
	        }
	    });
	}
	exports.getAllConfiguration = getAllConfiguration;


	function addSponsoredContent(req, res) {
	    var sponsoredContent = req.body
	    return elasticClient.index({
	        index: "sponsoredContent",
	        type: "sponsoredContent",
	        body: {
	            id: sponsoredContent.id,
	            author: sponsoredContent.author,
	            sponsor: sponsoredContent.sponsor,
	            domain: sponsoredContent.domain,
	            title: sponsoredContent.title,
	            link: sponsoredContent.link
	            }
	        }
	    );
	}
	exports.addSponsoredContent = addSponsoredContent;


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("elasticsearch");

/***/ }
/******/ ]);