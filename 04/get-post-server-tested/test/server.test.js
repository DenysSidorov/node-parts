const server = require('../server');
const request = require('request');
const assert = require('assert');
const fse = require('fs-extra');
const path = require('path');
const config = require('config');
const http = require('http');

describe('server tests', () => {
  before(done => {
    fse.mkdirpSync(config.get('filesRoot'));
    fse.emptyDirSync(config.get('filesRoot'));
    server.listen(3001, () => done());
  });
  after(done => {
    fse.removeSync(config.get('filesRoot'));
    server.close(() => done());
  });

  beforeEach(() => {
    fse.emptyDirSync(config.get('filesRoot'));
  });

  it('NODE_ENV should be `test`', () => {
    assert.strictEqual(process.env.NODE_ENV, 'test');
  });

  describe('GET', () => {
    it('should return index.html', done => {

      const content = fse.readFileSync(path.join(config.get('publicRoot'), 'index.html'));

      request('http://localhost:3001', (error, response, body) => {
        if (error) return done(error);

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.headers['content-type'], 'text/html');
        assert.strictEqual(body, content.toString('utf-8'));
        done();
      });
    });

    it('returns 200 & the file', done => {
      fse.copyFileSync(
        path.join(config.get('fixturesRoot'), 'index.js'),
        path.join(config.get('filesRoot'), 'index.js'),
      );

      const content = fse.readFileSync(path.join(config.get('filesRoot'), 'index.js'));

      request.get('http://localhost:3001/index.js', (err, response, body) => {
        if (err) return done(err);

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.headers['content-type'], 'application/javascript');
        assert.strictEqual(body, content.toString('utf-8'));
        done();
      });
    });

    it('should return 404', done => {
      request.get('http://localhost:3001/not_exists.png', (error, response, body) => {
        if (error) return done(error);

        assert.strictEqual(response.statusCode, 404);
        assert.strictEqual(body, 'Not found');
        done();
      });
    });

    it('should return 400', done => {
      request.get('http://localhost:3001/nested/path', (error, response, body) => {
        if (error) return done(error);

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(body, 'Nested paths are not allowed');
        done();
      });
    });
  });

  describe('POST', () => {
    it('returns 409 & file not modified', done => {
      fse.copyFileSync(
        path.join(config.get('fixturesRoot'), 'small.png'),
        path.join(config.get('filesRoot'), 'small.png'),
      );

      const mtime = fse.statSync(path.join(config.get('filesRoot'), 'small.png')).mtime;
      const req = request.post('http://localhost:3001/small.png', (error, response, body) => {
        if (error) return done(error);

        const newMtime = fse.statSync(path.join(config.get('filesRoot'), 'small.png')).mtime;

        assert.deepStrictEqual(mtime, newMtime);
        assert.strictEqual(response.statusCode, 409);
        assert.strictEqual(body, 'File exists');
        done();
      });

      fse.createReadStream(path.join(config.get('fixturesRoot'), 'small.png')).pipe(req);
    });

    it('returns 409 when zero file size', done => {
      fse.copyFileSync(
        path.join(config.get('fixturesRoot'), 'small.png'),
        path.join(config.get('filesRoot'), 'small.png'),
      );

      const mtime = fse.statSync(path.join(config.get('filesRoot'), 'small.png')).mtime;

      const req = request.post('http://localhost:3001/small.png', (error, response, body) => {
        if (error) return done(error);

        const newMtime = fse.statSync(path.join(config.get('filesRoot'), 'small.png')).mtime;

        assert.deepStrictEqual(mtime, newMtime);
        assert.strictEqual(response.statusCode, 409);
        assert.strictEqual(body, 'File exists');
        done();
      });

      req.end();
    });

    it('should handle big files', done => {
      const req = request(
        {uri: 'http://localhost:3001/big.png', method: 'POST'},
        (error, response, body) => {
          assert.strictEqual(response.statusCode, 413);
          assert.strictEqual(response.headers['connection'], 'close');
          assert.strictEqual(body, 'File is too big');

          assert.strictEqual(
            fse.existsSync(path.join(config.get('filesRoot'), 'big.png')),
            false
          );

          done();
        });

      req.on('error', err => {
        // EPIPE error should occur because we try to pipe after res closed
        if (err.code !== 'EPIPE') done(err);
      });

      fse.createReadStream(path.join(config.get('fixturesRoot'), 'big.png'))
        .pipe(req);

    });

    it('should create file', done => {
      const req = request.post('http://localhost:3001/small.png', (error, response, body) => {
        if (error) return done(error);

        assert.strictEqual(response.statusCode, 201);
        assert.strictEqual(body, 'File created');

        assert.ok(fse.existsSync(path.join(config.get('filesRoot'), 'small.png')));
        done();
      });

      fse.createReadStream(path.join(config.get('fixturesRoot'), 'small.png'))
        .pipe(req);
    });

    it('should handle terminated request', done => {
      const req = http.request('http://localhost:3001/example.txt', {
        method: 'POST'
      });

      req.on('error', err => {
        if (err.code !== 'ECONNRESET') return done(err);

        assert.strictEqual(
          fse.existsSync(path.join(config.get('filesRoot'), 'example.txt')),
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

  describe('DELETE', () => {
    it('should remove file', done => {
      fse.copyFileSync(
        path.join(config.get('fixturesRoot'), 'small.png'),
        path.join(config.get('filesRoot'), 'small.png'),
      );

      request.delete('http://localhost:3001/small.png', (error, response, body) => {
        if (error) return done(error);

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body, 'Ok');

        assert.strictEqual(
          fse.existsSync(path.join(config.get('filesRoot'), 'small.png')),
          false
        );

        done();
      });
    });

    it('should return 404', done => {
      request.delete('http://localhost:3001/small.png', (error, response, body) => {
        if (error) return done(error);

        assert.strictEqual(response.statusCode, 404);
        assert.strictEqual(body, 'Not found');
        done();
      });
    });
  });

});
