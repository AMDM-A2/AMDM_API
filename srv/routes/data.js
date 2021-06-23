const db = require('../utils/database.js')
const express = require('express')
const app = express()

/*
 * API : Data : GET
 */
app.get('/:id', function (req, res, next) {
  const id = req.params.id

  const sql = 'SELECT * FROM Data WHERE id = ?'

  db.get(sql, id, (err, row) => {
    if (err) return res.status(400).json({ error: err })
    if (!row) return res.status(404).json({ error: 'Data n°' + id + ' not found' })
    return res.status(200).json(row)
  })
})

/*
 * API : Data : POST
 */
app.post('/', function (req, res, next) {
  const id = req.body.id
  const idLot = req.body.idLot
  const capteur = req.body.capteur
  const date = req.body.date
  const valeur = req.body.valeur

  if (!idLot) return res.status(400).json({ error: 'Bad Request - The parameter \'idLot\' is required' })
  if (!capteur) return res.status(400).json({ error: 'Bad Request - The parameter \'capteur\' is required' })
  if (!date) return res.status(400).json({ error: 'Bad Request - The parameter \'date\' is required' })
  if (!valeur) return res.status(400).json({ error: 'Bad Request - The parameter \'valeur\' is required' })

  let array, sql

  if (id) {
    array = [id, idLot, capteur, date, valeur]
    sql = 'INSERT INTO Data (id, idLot, capteur, date, valeur) VALUES (?, ?, ?, ?, ?)'
  } else {
    array = [idLot, capteur, date, valeur]
    sql = 'INSERT INTO Data (idLot, capteur, date, valeur) VALUES (?, ?, ?, ?)'
  }

  const stmt = db.prepare(sql, array)
  stmt.run((err) => {
    if (err) return res.status(400).json({ error: err })
    res.setHeader('Location', req.baseUrl + '/' + stmt.lastID)
    return res.status(201).json()
  })
})

/*
 * API : Data : PUT
 */
app.put('/:id', function (req, res, next) {
  const id = req.params.id
  const idLot = req.body.idLot
  const capteur = req.body.capteur
  const date = req.body.date
  const valeur = req.body.valeur

  if (!id) return res.status(400).json({ error: 'Bad Request - The parameter \'id\' is required' })
  if (!idLot) return res.status(400).json({ error: 'Bad Request - The parameter \'idLot\' is required' })
  if (!capteur) return res.status(400).json({ error: 'Bad Request - The parameter \'capteur\' is required' })
  if (!date) return res.status(400).json({ error: 'Bad Request - The parameter \'date\' is required' })
  if (!valeur) return res.status(400).json({ error: 'Bad Request - The parameter \'valeur\' is required' })

  const array = [idLot, capteur, date, valeur, id]
  const sql = 'UPDATE Lots SET ' +
    'idLot = ?, ' +
    'capteur = ?, ' +
    'date = ?, ' +
    'valeur = ? ' +
    'WHERE id = ?'

  db.run(sql, array, (err) => {
    if (err) return res.status(400).json({ error: err })
    return res.status(200).json()
  })
})

module.exports = app
