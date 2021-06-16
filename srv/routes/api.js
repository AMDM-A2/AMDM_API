const db = require('../utils/database.js')
const express = require('express')
const app = express()

app.getLastProduct = function (rows, product) {
  const tmp = rows.filter(v => v && v.identifiant === product).sort((a, b) => a.hour.localeCompare(b.hour))
  return (tmp && tmp.length && tmp[tmp.length - 1].valeur) || undefined
}

app.getLastAlert = function (rows) {
  const tmp = rows.filter(v => v && v.identifiant === 'alert').sort((a, b) => a.hour.localeCompare(b.hour))
  return (tmp && tmp.length && tmp[tmp.length - 1].valeur) || undefined
}

app.getProductSum = function (rows, product) {
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
    rows.forEach(row => {
      lots[row.numeroLot] ? lots[row.numeroLot].push(row) : lots[row.numeroLot] = [row]
    })

    const finalLots = []
    for (const r in lots) {
      finalLots.push({
        lotId: r,
        alert: app.getLastAlert(lots[r]),
        productA: app.getLastProduct(lots[r], 'produitA'),
        productB: app.getLastProduct(lots[r], 'produitB'),
        productC: app.getLastProduct(lots[r], 'produitC'),
        totalProductA: app.getProductSum(lots[r], 'produitA'),
        totalProductB: app.getProductSum(lots[r], 'produitB'),
        totalProductC: app.getProductSum(lots[r], 'produitC')
      })
    }

    res.json(finalLots.sort((a, b) => b.lotId - a.lotId))
  })
})

module.exports = app
