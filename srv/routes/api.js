var db = require('./database.js')
var express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.json({ yes: 'oui' })
})
/* GET API page. */
app.get('/data', function (req, res, next) {
  var sql = 'select * from Gestion'
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

module.exports = app
