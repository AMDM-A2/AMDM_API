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
        assert.strictEqual(JSON.parse(body)[0].lotId, '1')
      })
    })
    it('API PATCH Alert', function () {
      request.patch('http://localhost:3000/api/v1/alert', { id: 1, description: 'test' }, (err, response, body) => {
        if (err) assert.fail('Error while getting API')
        assert.strictEqual(body, 'ok')
        request.get('http://localhost:3000/api/v1/alerts', (err, response, body) => {
          if (err) assert.fail('Error while getting API')
          assert.strictEqual(JSON.parse(body).results.find(v => v.id === 1).description, '1234')
        })
      })
    })
  })
})
