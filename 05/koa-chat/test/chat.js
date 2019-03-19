// https://github.com/request/request-promise
const request = require('request-promise');
const app = require('../app');
const assert = require('assert');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('server', () => {
  let server;
  before(done => {
    server = app.listen(3000, done);
  });

  after(done => {
    server.close(done);
  });

  describe('POST /publish', () => {
    it('sends a message to all subscribers', async () => {
      const message = 'text';

      const subscribers = Promise.all([
        request({
          method: 'GET',
          url: 'http://127.0.0.1:3000/subscribe',
          timeout: 500
        }),
        request({
          method: 'GET',
          url: 'http://127.0.0.1:3000/subscribe',
          timeout: 500
        })
      ]);

      await sleep(50);

      const publisherResponse = await request({
        method: 'POST',
        url: 'http://127.0.0.1:3000/publish',
        json: true,
        body: {
          message
        }
      });

      const messages = await subscribers;

      messages.forEach(msg => {
        assert.deepEqual(msg, message);
      });

      assert.deepEqual(publisherResponse, 'ok');
    });

    context('when body is too big', () => {

      it('returns 413', async () => {
        // TODO: fix EPIPE error
          const response = await request({
            method: 'POST',
            uri: 'http://127.0.0.1:3000/publish',
            body: {
              message: '*'.repeat(1e6)
            },

            json: true,
            simple: false, // don't die on http errors
            resolveWithFullResponse: true // resolve with response instead of response.body
          });

          assert.deepEqual(response.statusCode, 413);

      });

      it('message is ignored', async function () {
        // TODO: fix EPIPE error
        const subscriber = request({
          method: 'GET',
          url: 'http://127.0.0.1:3000/subscribe',
          timeout: 100,
          simple: false,
          resolveWithFullResponse: true
        });

        await sleep(50);

        await request({ // will die with 413, but we tested it before
          method: 'POST',
          url: 'http://127.0.0.1:3000/publish',
          json: true,
          simple: false,
          resolveWithFullResponse: true,
          body: {
            message: '*'.repeat(1e6)
          },
        });

        try {
          await subscriber;
          assert.fail('Should not reach here, but die with ESOCKETTIMEDOUT');
        } catch(err) {
          assert.deepEqual(err.name, 'RequestError');
          assert.deepEqual(err.cause.code, 'ESOCKETTIMEDOUT');
        }
      });
    });

  });

});
