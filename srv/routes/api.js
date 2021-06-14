const db = require('./database.js')
const express = require('express')
const app = express()

/* GET API page. */
app.get('/data', function (req, res, next) {
  const sql = 'select * from Gestion'
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    rows.sort(function (a, b) {
      return a.hour.localeCompare(b.hour)
    })
    res.json(rows)
  })
})

module.exports = app
