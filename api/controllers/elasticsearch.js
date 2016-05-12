var elasticsearch = require('elasticsearch');

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
    res.send(configuration);
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

function getAllConfigurationAuthorAll(req, res) {
    elasticClient.search({
        index: "configuration",
        type: "configuration",
        body: {
          query: {
            match: {
              "fields": [ "authorName" ]
            }
          }
        }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.send(hits);
    });
}
exports.getAllConfigurationAuthorAll = getAllConfigurationAuthorAll;

function getAllConfigurationByDomain(req, res) {
    return elasticClient.get({
        index: "configuration",
        type: "configuration",
        body: {
          query: {
            multi_match: {
              match:{
                authorName: ""
              },
              query: 'express js',
              fields: ['domainName']
            }
          }
        }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.send(hits);
    });
}

function getAllConfigurationByDomainAll(req, res) {
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
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.send(hits);
    });
}
exports.getAllConfigurationByDomainAll = getAllConfigurationByDomainAll;

function getAllConfigurationByDomainAuthor(req, res) {
    return elasticClient.get({
        index: "configuration",
        type: "configuration",
        body: {
          query: {
            multi_match: {
              query: 'express js',
              fields: ['domainName', 'authorName']
            }
          }
        }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.send(hits);
    });
}
exports.getAllConfigurationByDomainAuthor = getAllConfigurationByDomainAuthor;


function addSponsoredContent(req, res) {
    var sponsoredContent = req.body
    return elasticClient.index({
        index: "sponsoredcontent",
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

    ).then(res.status(201)).then(res.send(sponsoredContent));
}
exports.addSponsoredContent = addSponsoredContent;

function getAllSponsoredContentByDomain(req, res) {
    // var domainName = require('domainName');
    var test = req.params;
    return elasticClient.get({
        index: "sponsoredcontent",
        type: "sponsoredcontent",
        body: {
          query: {
            multi_match: {
              query: test.domainName,
              fields: ['domainName']
            }
          }
        }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.send(hits);
    });
}
exports.getAllSponsoredContentByDomain = getAllSponsoredContentByDomain;

function getAllSponsoredContentByDomainAuthor(req, res) {
    return elasticClient.get({
        index: "sponsoredcontent",
        type: "sponsoredcontent",
        body: {
          query: {
            multi_match: {
              query: 'express js',
              fields: ['domainName', 'authorName']
            }
          }
        }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.send(hits);
    });
}
exports.getAllSponsoredContentByDomainAuthor = getAllSponsoredContentByDomainAuthor;
