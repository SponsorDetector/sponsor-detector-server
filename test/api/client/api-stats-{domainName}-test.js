'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;
var expect = chai.expect;

describe('/api/stats/{domainName}', function() {
  describe('get', function() {
    it('should respond with 200 A list of stats for a...', function(done) {
      /*eslint-disable*/
      var schema = {
        "properties": {
          "author": {
            "type": "string",
            "description": "An author name"
          },
          "sponsor": {
            "type": "string",
            "description": "A sponsor name"
          },
          "domain": {
            "type": "string",
            "description": "A domain name"
          },
          "title": {
            "type": "string",
            "description": "A stat title"
          },
          "link": {
            "type": "string",
            "description": "A stat link"
          }
        }
      };

      /*eslint-enable*/
      api.get('/api/stats/{domainName PARAM GOES HERE}')
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
      api.get('/api/stats/{domainName PARAM GOES HERE}')
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
