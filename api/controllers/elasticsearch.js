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
  var configuration = req.body
  elasticClient.index({
    index : Configuration.configuration.index,
    type : Configuration.configuration.type,
    body: {
      domain: configuration.domain,
      name: configuration.name,
      author: {
        extractor: {
          name: configuration.author.extractor.name,
          params: configuration.author.extractor.params
        }
      },
      sponsor: {
        detector: {
          name: configuration.sponsor.detector.name,
          params: configuration.sponsor.detector.params
        },
        extractor: {
          name: configuration.sponsor.extractor.name,
          params: configuration.sponsor.extractor.params
        }
      },
      status: configuration.status
    }
  });
  res.status(201);
  res.send(configuration);
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

function getAllConfigurationByDomain(req, res) {
  var domainName = req.swagger.params.domainName.value;

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
  });
}
exports.getAllConfigurationByDomain = getAllConfigurationByDomain;


exports.getAllConfigurationByDomainAuthor = function (req, res) {
  var domainName = req.swagger.params.domainName.value;
  var authorName = req.swagger.params.authorName.value;
  console.log("GET", domainName, authorName);
  elasticClient.search({
    index : Configuration.configuration.index,
    type : Configuration.configuration.type,
    body : {
      query : {
        "bool": {
          "must": [
            { "match": { "domain":  domainName }},
            { "match": { "author": authorName   }}
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
  });
}


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
