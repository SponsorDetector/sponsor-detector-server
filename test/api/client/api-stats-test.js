'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;
var expect = chai.expect;

describe('/api/stats', function() {
  describe('post', function() {
    it('should respond with 201 New stat created', function(done) {
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
      api.post('/api/stats')
      .set('Accept', 'application/json')
      .send({
        stat: 'DATA GOES HERE'
      })
      .expect(201)
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
      api.post('/api/stats')
      .set('Accept', 'application/json')
      .send({
        stat: 'DATA GOES HERE'
      })
      .expect('DEFAULT RESPONSE CODE HERE')
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

  });

});
