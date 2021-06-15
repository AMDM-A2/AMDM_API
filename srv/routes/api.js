const db = require('./database.js')
const express = require('express')
const app = express()

function getLastProduct (rows, product) {
  const tmp = rows.filter(v => v && v.identifiant === product).sort((a, b) => a.hour.localeCompare(b.hour))
  return (tmp && tmp.length && tmp[tmp.length - 1].valeur) || undefined
}

function getLastAlert (rows) {
  const tmp = rows.filter(v => v && v.identifiant === 'alert').sort((a, b) => a.hour.localeCompare(b.hour))
  return (tmp && tmp.length && tmp[tmp.length - 1].valeur) || undefined
}

function getProductSum (rows, product) {
  const tmp = rows.filter(v => v && v.identifiant === product).reduce((v, i) => v + i.valeur, 0)
  return tmp || undefined
}

/* GET API page. */
app.get('/data', function (req, res, next) {
  const sql = 'SELECT * FROM Gestion'
  // SELECT identifiant,valeur FROM Gestion WHERE identifiant LIKE "produit%" GROUP BY identifiant HAVING MAX(hour);

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }

    const lots = {}
    for (const row of rows) {
      const tmp = JSON.parse(JSON.stringify(row))
      delete tmp.id
      delete tmp.numeroLot
      if (lots[row.numeroLot]) lots[row.numeroLot].push(tmp)
      else lots[row.numeroLot] = [tmp]
    }

    const finalLots = []
    for (const r in lots) {
      finalLots.push({
        lotId: r,
        alert: getLastAlert(lots[r]),
        productA: getLastProduct(lots[r], 'produitA'),
        productB: getLastProduct(lots[r], 'produitB'),
        productC: getLastProduct(lots[r], 'produitC'),
        totalProductA: getProductSum(lots[r], 'produitA'),
        totalProductB: getProductSum(lots[r], 'produitB'),
        totalProductC: getProductSum(lots[r], 'produitC')
      })
    }

    res.json(finalLots.sort((a, b) => b.lotId - a.lotId))
  })
})

module.exports = app
