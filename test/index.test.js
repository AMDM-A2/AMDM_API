const assert = require('assert')
const request = require('request')
const api = require('../srv/routes/api')
const db = require('../srv/utils/database.js')
const fs = require('fs')

/* eslint-env node, mocha */
describe('Test principal', function () {
  describe('Mocha', function () {
    it('Mocha work', function () {
      assert.strictEqual(true, true)
    })
  })
  describe('DB', function () {
    it('work', function () {
      assert.notStrictEqual(db, null)
    })
    it('file is create', function () {
      fs.access('./db.db', fs.F_OK, (err) => {
        if (err) assert.fail('Error while getting DB file')
        else assert.ok(true)
      })
    })
  })
  describe('API', function () {
    it('work', function () {
      assert.notStrictEqual(api, null)
    })
    it('get data', function () {
      request.get('http://localhost:3000/api/v1/data', (err, response, body) => {
        if (err) assert.fail('Error while getting API')
        assert.strictEqual(response.statusCode, 200)
      })
    })
    it('get data verify body', function () {
      request.get('http://localhost:3000/api/v1/data', (err, response, body) => {
        if (err) assert.fail('Error while getting API')
        assert.ok((String)(body).includes('{"lotId":"12912","data":[{"typeProduit":"Alert","heure":"2021-06-11 23:09:52","valeur":35,"sum":956},{"typeProduit":"Produit A","heure":"2021-06-11 23:53:46","valeur":31,"sum":705},{"typeProduit":"Produit B","heure":"2021-06-11 22:56:42","valeur":43,"sum":611},{"typeProduit":"Produit C","heure":"2021-06-11 22:28:21","valeur":18,"sum":594}]}'))
      })
    })
  })
})
