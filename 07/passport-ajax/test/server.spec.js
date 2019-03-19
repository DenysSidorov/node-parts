const app = require('../app');
const request = require('request-promise').defaults({
  simple: false,
  resolveWithFullResponse: true
});
const assert = require('assert');

const User = require('../models/User');
const mongoose = require('../libs/mongoose');

const serverURL = 'http://localhost:3333';

function getURL(path) {
  return `${serverURL}${path}`;
}

async function loginUser(userData) {
  const jar = request.jar();

  const response = await request({
      method: 'post',
      url: getURL('/login'),
      json: true,
      body: userData,
      jar
  });

  return {response, jar};
}

const existingUserData = {
  email: 'john@test.ru',
  displayName: 'John',
  password: '123456'
};
const newUserData = {
  email: 'alice@test.ru',
  displayName: 'Alice',
  password: '123456'
};

let existingUser;
let server;

describe('Passport authorization', () => {
  before(async function () {
    await User.remove({});
    existingUser = await User.create(existingUserData);
    server = app.listen(3333);
  });

  after(async () => {
    await User.remove({});
    server.close();
    mongoose.disconnect();
  });

  describe('main page', () => {
    context('for anonymous user', () => {
      it('should return login page', async function () {
        const response = await request({
            method: 'get',
            url: getURL('/')
        });

        assert.strictEqual(response.statusCode, 200);
        assert.ok(/Please sign in/.test(response.body));
      });
    });
    context('for logged user', () => {
      it('should return welcome page', async function () {
        const {jar} = await loginUser(existingUserData);

        const response = await request({
            method: 'get',
            url: getURL('/'),
            jar
        });

        assert.strictEqual(response.statusCode, 200);
        assert.ok(/You are logged in\./.test(response.body));
      });
    });
  });

  describe('login flow', () => {
    context("user doesn't exist", () => {
      it('should return 401', async function () {
        const response = await request({
            method: 'post',
            url: getURL('/login'),
            json: true,
            body: newUserData
        });

        assert.strictEqual(response.statusCode, 401);
        assert.deepStrictEqual(response.body, {
          message: 'Нет такого пользователя или пароль неверен.'
        });
      });
    });

    context('user exists', () => {
      it('should login user', async function () {
        const jar = request.jar();

        const response = await request({
            method: 'post',
            url: getURL('/login'),
            json: true,
            body: existingUserData,
            jar
        });

        assert.strictEqual(response.statusCode, 200);
        assert.deepStrictEqual(response.body, {
          displayName: 'John', email: 'john@test.ru'
        });

        const cookieNames = jar.getCookies(serverURL).map(cookie => cookie.key);
        assert.ok(cookieNames.includes('koa:sess'));
      });
    });
  });
});
