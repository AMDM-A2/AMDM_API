const db = require('../utils/database.js')
const express = require('express')
const app = express()

/* API : Lot : POST */
app.post('/', function (req, res, next) {
  const id = req.body.id
  const description = req.body.description

  if (!description) return res.status(400).json({ error: 'Bad Request - The parameter \'description\' is required' })

  let array, sql

  if (id) {
    array = [id, description]
    sql = 'INSERT INTO Lots (id, description) VALUES (?, ?)'
  } else {
    array = [description]
    sql = 'INSERT INTO Lots (description) VALUES (?)'
  }

  const stmt = db.prepare(sql, array)
  stmt.run((err) => {
    if (err) return res.status(400).json({ error: err })
    res.setHeader('Location', req.baseUrl + '/' + stmt.lastID)
    return res.status(201).json()
  })
})

/* API : Lot : PUT */
app.put('/:id', function (req, res, next) {
  const id = req.params.id
  const description = req.body.description

  if (!id) return res.status(400).json({ error: 'Bad Request - The parameter \'id\' is required' })
  if (!description) return res.status(400).json({ error: 'Bad Request - The parameter \'description\' is required' })

  const array = [id, description]
  const sql = 'UPDATE Lots SET description = ? WHERE id = ?'

  db.run(sql, array, (err) => {
    if (err) return res.status(400).json({ error: err })
    return res.status(200).json()
  })
})

module.exports = app
