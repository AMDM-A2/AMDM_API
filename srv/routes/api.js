const db = require('./database.js')
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.json({ yes: 'oui' })
})

/* GET API page. */
app.get('/data', function (req, res, next) {
  const sql = 'select * from Gestion'
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

module.exports = app
