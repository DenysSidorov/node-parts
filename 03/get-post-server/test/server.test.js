const server = require('../server');
const request = require('request');
const fs = require('fs');
const path = require('path');
const config = require('config');
const assert = require('assert');
const http = require('http');

describe('server tests', () => {
  before(done => {
    server.listen(3000, done);
  });

  after(done => {
    server.close(done);
  });

  describe('GET', () => {
    it('index.html', done => {

      const content = fs.readFileSync(path.join(
        config.get('publicRoot'),
        'index.html'
      ), { encoding: 'utf-8' });

      request('http://localhost:3000', (err, response, body) => {
        if (err) return done(err);

        assert.strictEqual(content, body);
        done();
      });

    });
  });

  describe('POST', () => {
    it('empty file', done => {
      const req = http.request(
        'http://localhost:3000/file.txt',
        {method: 'POST'},

        res => {
          console.log(`STATUS: ${res.statusCode}`);
          console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
          let body = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () => {
            console.log(body);
            done();
          });
        }
      );

      req.end();
    });

    it('terminated request', done => {
      const req = http.request(
        'http://localhost:3000/terminated.txt',
        {method: 'POST'},
        res => {}
      );

      req.on('error', err => {
        console.log(err.code); // 'ECONNRESET'
        done();
      });

      req.write('lala');

      setTimeout(() => {
        req.abort();
      }, 1500);
    });
  });

  describe('DELETE', () => {});
});
