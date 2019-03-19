const server = require('../server');
const request = require('request');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const config = require('config');
const http = require('http');

describe('server tests', () => {
  before(done => {
    server.listen(3001, () => done());
  });
  after(done => {
    server.close(() => done());
  });

  beforeEach(() => {});
  afterEach(() => {});

  describe('GET', () => {
    it('should return index.html', done => {
      /*
      1. launch server
      2. make request "http://localhost:3000/"
      3. wait response
      4. compare response with local file content
      5. stop server
      */

      request('http://localhost:3001', (error, response, body) => {
        if (error) return done(error);

        const content = fs.readFileSync(path.join(config.get('publicRoot'), 'index.html'));

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.headers['content-type'], 'text/html');
        assert.strictEqual(body, content.toString('utf-8'));
        done();
      });
    });
  });

  describe('POST', () => {
    it('should handle terminated request', done => {
      const req = http.request('http://localhost:3001/example.txt', {
        method: 'POST'
      });

      req.on('error', err => {
        if (err.code !== 'ECONNRESET') return done(err);

        assert.strictEqual(
          fs.existsSync(path.join(config.get('filesRoot'), 'example.txt')),
          false
        );
        done();
      });

      req.write('content');

      setTimeout(() => {
        req.abort();
      }, 300);
    });
  });

  describe('DELETE', () => {});

});
