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
        assert.ok((String)(body).includes('{"lotId":"12913","productA":5,"totalProductA":5}'))
      })
    })
    describe('API get last product', function () {
      it('NULL', function () {
        assert.equal(api.getLastProduct([], 'produitA'), undefined)
      })
      it('NORMAL', function () {
        assert.equal(api.getLastProduct([{
          numeroLot: 12912,
          identifiant: 'produitA',
          hour: '2021-06-11 22:07:19',
          valeur: 32
        }, {
          numeroLot: 12912,
          identifiant: 'produitA',
          hour: '2021-06-10 05:37:03',
          valeur: 45
        }], 'produitA'), 32)
      })
    })
    describe('API get last alert', function () {
      it('NULL', function () {
        assert.equal(api.getLastAlert([], 'produitA'), undefined)
      })
      it('NORMAL', function () {
        assert.equal(api.getLastAlert([{
          numeroLot: 12912,
          identifiant: 'alert',
          hour: '2021-06-11 22:07:19',
          valeur: 65
        }, {
          numeroLot: 12912,
          identifiant: 'alert',
          hour: '2021-06-10 05:37:03',
          valeur: 45
        }]), 65)
      })
    })
    describe('API get product sum', function () {
      it('NULL', function () {
        assert.equal(api.getProductSum([], 'produitA'), undefined)
      })
      it('NORMAL', function () {
        assert.equal(api.getProductSum([{
          numeroLot: 12912,
          identifiant: 'produitA',
          hour: '2021-06-11 22:07:19',
          valeur: 32
        }, {
          numeroLot: 12912,
          identifiant: 'produitA',
          hour: '2021-06-10 05:37:03',
          valeur: 45
        }], 'produitA'), 77)
      })
    })
  })
})
