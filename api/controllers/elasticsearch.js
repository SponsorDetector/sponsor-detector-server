var elasticsearch = require('elasticsearch');

var Configuration = require('../commons/Configuration');

var elasticClient = new elasticsearch.Client({
  host: Configuration.es.host + ":" + Configuration.es.port,
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
  return elasticClient.indices.putMapping({
    index : Configuration.configuration.index,
    type : Configuration.configuration.type,
    body:  {
      dynamic_templates: [{
        string_fields: {
          match: "*",
          match_mapping_type: "string",
          mapping: {
            index: "not_analyzed",
            omit_norms: true,
            type: "string"
          }
        }
      }],
      properties: {
        pushed_at: {
          type: "date",
          format: "yyyy-MM-dd HH:mm"
        }
      }
    }
  }, {
    index: sponsoredContent,
    type: "sponsoredContent",
    body: {
      dynamic_templates: [{
        string_fields: {
          match: "*",
          match_mapping_type: "string",
          mapping: {
            index: "not_analyzed",
            omit_norms: true,
            type: "string"
          }
        }
      }],
      properties: {
        pushed_at: {
          type: "date",
          format: "yyyy-MM-dd HH:mm"
        }
      }
    }
  });
}
exports.initMapping = initMapping;

function addConfiguration(req, res) {
  console.log(req);
  var configuration = req.body;
  if (configuration.authorName && configuration.author) {
  	var authoredConf = {
  		domain : configuration.domain,
  		authorName : configuration.authorName,
  		author : configuration.author
  	};
    elasticClient.index({
      index : Configuration.configuration.index,
      type : Configuration.configuration.type,
      body: authoredConf
    });
	// sauvegarde de la premiere
  }

  var sponsorConf = {
  	domain : configuration.domain,
  	sponsor : configuration.sponsor
  }
  elasticClient.index({
    index : Configuration.configuration.index,
    type : Configuration.configuration.type,
    body: sponsorConf
  });
  res.status(201);


  console.log("[------------------------------------------]");
  if (configuration.authorName) {
    console.log("[ERRORzefzef]" );
    elasticClient.search({
        index: "sponsoredcontent",
        type: "sponsoredcontent",
        body: {
          query : {
            "bool": {
              "must": [
                { "match": { "domain": sponsorConf.domain }},
                { "match": { "author": authoredConf.authorName  }}
              ]
            }
          }
        }
    }, function(error, response, status) {
      if (error) {
        console.log("[ERROR]" + error);
      }
      else {
        res.send(response.hits.hits);
      }
    })
  console.log("dfzeggz");
  elasticClient.search({
      index: "sponsoredcontent",
      type: "sponsoredcontent",
      body: {
        query: {
          match: {
            "domain": sponsorConf.domain
          }
        }
      }
  }, function(error, response, status) {
    if (error) {
      console.log("[ERROR]" + error);
    }
    else {
        console.log("dfzergqergergqergqergqergggz");
      res.send(response.hits.hits);
    }
  })
  //res.send(configuration);
}
exports.addConfiguration = addConfiguration;

function getAllConfiguration(req, res) {
  elasticClient.search({
    index : Configuration.configuration.index,
    type : Configuration.configuration.type,
    body: {
      query: {
        match_all: {}
      }
    }
  }).then(function(resp) {
    var hits = resp.hits.hits;
    res.send(hits);
  });
}
exports.getAllConfiguration = getAllConfiguration;

function getAllConfigurationAuthorAll(req, res) {
  var authorName = req.swagger.params.authorName.value;
  console.log("GET CONF ALL", authorName);
    elasticClient.search({
        index: "configuration",
        type: "configuration",
        body: {
          query: {
            match: {
              "domain": "\*" // tocheck
            }
          }
        }
    }, function(error, response, status) {
      if (error) {
        console.log("[ERROR]" + error);
      }
      else {
        res.send(response.hits.hits);
      }
    })
}
exports.getAllConfigurationAuthorAll = getAllConfigurationAuthorAll;

function getAllConfigurationByDomain(req, res) {
  var domainName = req.swagger.params.domainName.value;
  console.log("GET CONF", domainName);
  elasticClient.search({
    index : Configuration.configuration.index,
    type : Configuration.configuration.type,
    body : {
      query : {
        match : {
          "domain" : domainName
        }
      }
    }
  }, function(error, response, status) {
    if (error) {
      console.log("[ERROR]" + error);
    }
    else {
      res.send(response.hits.hits);
    }
  })
}
exports.getAllConfigurationByDomain = getAllConfigurationByDomain;

function getAllConfigurationByDomainAll(req, res) {
    console.log("GET CONF", domainName, authorName);
    return elasticClient.search({
        index: "configuration",
        type: "configuration",
        body: {
          query: {
            multi_match: {
              //TODO
            }
          }
        }
    }, function(error, response, status) {
      if (error) {
        console.log("[ERROR]" + error);
      }
      else {
        res.send(response.hits.hits);
      }
    })
}
exports.getAllConfigurationByDomainAll = getAllConfigurationByDomainAll;


exports.getAllConfigurationByDomainAuthor = function (req, res) {
  var domainName = req.swagger.params.domainName.value;
  var authorName = req.swagger.params.authorName.value;
  console.log("GET CONF", domainName, authorName);
  elasticClient.search({
    index : Configuration.configuration.index,
    type : Configuration.configuration.type,
    body : {
      query : {
        "bool": {
          "must": [
            { "match": { "domain":  domainName }},
            { "match": { "author": authorName  }}
          ]
        }
      }
    }
  }, function(error, response, status) {
    if (error) {
      console.log("[ERROR]" + error);
    }
    else {
      res.send(response.hits.hits);
    }
  })
}

function getAllConfigurationByAuthor(req, res) {
  var domainName = req.swagger.params.domainName.value;
  console.log("GET CONF", authorName);
  elasticClient.search({
    index : Configuration.configuration.index,
    type : Configuration.configuration.type,
    body : {
      query : {
        match : {
          "author" : authorName
        }
      }
    }
  }, function(error, response, status) {
    if (error) {
      console.log("[ERROR]" + error);
    }
    else {
      res.send(response.hits.hits);
    }
  })
}
exports.getAllConfigurationByDomain = getAllConfigurationByDomain;

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
  });
}
exports.addSponsoredContent = addSponsoredContent;


function getAllSponsoredContentByDomain(req, res) {
    var domainName = req.swagger.params.domainName.value;
    console.log("GET STAT", domainName);
    return elasticClient.search({
        index: "sponsoredcontent",
        type: "sponsoredcontent",
        body: {
          query : {
            match : {
              "domain" : domainName
            }
          }
        }
    }, function(error, response, status) {
      if (error) {
        console.log("[ERROR]" + error);
      }
      else {
        res.send(response.hits.hits);
      }
    })
}
exports.getAllSponsoredContentByDomain = getAllSponsoredContentByDomain;

function getAllSponsoredContentByDomainAuthor(req, res) {
  var domainName = req.swagger.params.domainName.value;
  var authorName = req.swagger.params.authorName.value;
  console.log("GET STAT", domainName, authorName);
    return elasticClient.search({
        index: "sponsoredcontent",
        type: "sponsoredcontent",
        body : {
          query : {
            "bool": {
              "must": [
                { "match": { "domain":  domainName }},
                { "match": { "author": authorName  }}
              ]
            }
          }
        }
    }, function(error, response, status) {
      if (error) {
        console.log("[ERROR]" + error);
      }
      else {
        res.send(response.hits.hits);
      }
    })
}
exports.getAllSponsoredContentByDomainAuthor = getAllSponsoredContentByDomainAuthor;
