const assert = require('assert')
const request = require('request')
const api = require('../srv/routes/api')
const db = require('../srv/routes/database.js')
const fs = require('fs')

/* eslint-env node, mocha */
describe('Test principal', function () {
  describe('Mocha', function () {
    it('Mocha work', function () {
      assert.equal(true, true)
    })
  })
  describe('DB', function () {
    it('DB work', function () {
      assert.notEqual(db, null)
    })
    it('DB file is create', function () {
      fs.access('./db.db', fs.F_OK, (err) => {
        if (err) {
          assert.ok(false)
        } else {
          assert.ok(true)
        }
      })
    })
  })
  describe('API', function () {
    it('API work', function () {
      assert.notEqual(api, null)
    })
    it('API get data', function () {
      // eslint-disable-next-line node/handle-callback-err
      request.get('http://localhost:3000/api/v1/data', function (err, response, body) {
        console.log(response)
        assert.equal(response.statusCode, 200)
      })
    })
  })
})
