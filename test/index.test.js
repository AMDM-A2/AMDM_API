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
    it('DB work', function () {
      assert.notStrictEqual(db, null)
    })
    it('DB file is create', function () {
      fs.access('./db.db', fs.F_OK, (err) => {
        if (err) assert.fail('Error while getting DB file')
        else assert.ok(true)
      })
    })
  })
  describe('API', function () {
    it('API work', function () {
      assert.notStrictEqual(api, null)
    })
    it('API get data', function () {
      request.get('http://localhost:3000/api/v1/data', (err, response, body) => {
        if (err) assert.fail('Error while getting API')
        assert.strictEqual(response.statusCode, 200)
      })
    })
    it('API get data verify response', function () {
      request.get('http://localhost:3000/api/v1/data', (err, response, body) => {
        if (err) assert.fail('Error while getting API')
        assert.ok((String)(body).includes('{"lotId":"12913","productA":5,"totalProductA":5}'))
      })
    })
  })
})
