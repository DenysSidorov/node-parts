const app = require('../app');
const puppeteer = require('puppeteer');
const mongoose = require('../libs/mongoose');
const assert = require('assert');
const config = require('config');

// puppeteer options
const opts = {
  headless: false,
  slowMo: 300,
  timeout: 60000,
  args: [
    '--disable-notifications'
  ]
};

describe('passport-facebook tests', () => {
  let server;
  let browser;
  let page;

  before(done => {
    server = app.listen(3000, () => {
      puppeteer
        .launch(opts)
        .then(_browser => {
          browser = _browser;
          done();
        });
    });
  });

  after(done => {
    browser.close();
    mongoose.disconnect();
    server.close(done);
  });

  it('should login user using facebook', async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000', {waitUntil: 'networkidle0'});

    const heading = await page.evaluate(() => document.querySelector('form h1').textContent);
    assert.strictEqual(heading, 'Please sign in');
    await page.click('[data-provider=facebook]');
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    await page.type('#email', config.get('providers.facebook.test.login'));
    await page.type('#pass', config.get('providers.facebook.test.password'));

    await page.click('#loginbutton');
    await page.waitForNavigation({waitUntil: 'networkidle2'});

    const confirmButton = await page.$('[name=__CONFIRM__]');
    console.log(confirmButton);
    if (confirmButton) {
      console.log('click');
      await confirmButton.click();
    }

    await page.waitForNavigation({waitUntil: 'networkidle2'});

    assert.strictEqual(page.url(), 'http://localhost:3000/');

    const greeting = await page.evaluate(() => document.querySelector('.greeting').textContent);
    assert.strictEqual(greeting, 'You are logged in.');
  });
});
