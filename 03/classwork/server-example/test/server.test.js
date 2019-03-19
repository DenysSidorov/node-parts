const server = require('../server');
const request = require('request');
const fs = require('fs');
const path = require('path');
const config = require('config');
const http = require('http');

describe('server tests', () => {
  before(done => {
    server.listen(3000, () => done());
  });
  after(done => {
    server.close(() => done());
  });

  describe('complex case', () => {
    it('should handle get and delete requests', done => {
      let finished = false;

      request({
        uri: 'http://localhost:3000/file.txt',
        method: 'GET'
      }, (error, response, body) => {
        console.log('GET');
        console.log(response.statusCode);
        console.log(body);
        if (!finished) {
          finished = true;
          done();
        }
      });

      request({
        uri: 'http://localhost:3000/file.txt',
        method: 'DELETE'
      }, (error, response, body) => {
        console.log('DELETE');
        console.log(response.statusCode);
        console.log(body);
        if (!finished) {
          finished = true;
          done();
        }
      });
    });
  });

});
