'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;
var expect = chai.expect;

describe('/api/conf/{domainName}/{authorName}', function() {
  describe('get', function() {
    it('should respond with 200 A list of confs for a...', function(done) {
      /*eslint-disable*/
      var schema = {
        "properties": {
          "domain": {
            "type": "string",
            "description": "Name of the domain"
          },
          "name": {
            "type": "string",
            "description": "Name of the conf"
          },
          "author": {
            "properties": {
              "extractor": {
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Name of the extractor"
                  },
                  "params": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "sponsor": {
            "properties": {
              "extractor": {
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Name of the extractor"
                  },
                  "params": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              },
              "detector": {
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Name of the detector"
                  },
                  "params": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "status": {
            "type": "string",
            "description": "Status of the conf"
          },
          "pushedAt": {
            "type": "string",
            "format": "dateTime"
          },
          "updatedAt": {
            "type": "string",
            "format": "dateTime"
          }
        }
      };

      /*eslint-enable*/
      api.get('/api/conf/{domainName PARAM GOES HERE}/{authorName PARAM GOES HERE}')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

    it('should respond with default Error', function(done) {
      /*eslint-disable*/
      var schema = {
        "required": [
          "mess"
        ],
        "properties": {
          "mess": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.get('/api/conf/{domainName PARAM GOES HERE}/{authorName PARAM GOES HERE}')
      .set('Accept', 'application/json')
      .expect('DEFAULT RESPONSE CODE HERE')
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

  });

});
