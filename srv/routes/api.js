const db = require('./database.js')
const express = require('express')
const app = express()

function getLastProduct(rows, product) {
  const tmp = rows.filter(v => v && v.identifiant === product).sort((a, b) => a.hour.localeCompare(b.hour))
  return tmp && tmp.length && tmp[tmp.length - 1].valeur || undefined
}

function getLastAlert(rows) {
  const tmp = rows.filter(v => v && v.identifiant === 'alert').sort((a, b) => a.hour.localeCompare(b.hour))
  return tmp && tmp.length && tmp[tmp.length - 1].valeur || undefined
}

function getProductSum(rows, product) {
  const tmp = rows.filter(v => v && v.identifiant === product).reduce((v, i) => v + i.valeur, 0)
  return tmp || undefined
}

function getBundleNumber(rows) {
  return rows && rows[0].numeroLot || undefined
}

/* GET API page. */
app.get('/data', function (req, res, next) {
  const sql = 'SELECT identifiant, numeroLot, hour, valeur FROM Gestion WHERE numeroLot = (SELECT MAX(numeroLot) FROM Gestion)';
  //SELECT identifiant,valeur FROM Gestion WHERE identifiant LIKE "produit%" GROUP BY identifiant HAVING MAX(hour);

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }


    res.json([{
      name: 'Test',
      productA: getLastProduct(rows, "produitA"), 
      productB: getLastProduct(rows, "produitB"), 
      productC: getLastProduct(rows, "produitC"),
      bundleNumber:  getBundleNumber(rows),
      alert: getLastAlert(rows),
      totalProductA: getProductSum(rows, "produitA"), 
      totalProductB: getProductSum(rows, "produitB"), 
      totalProductC: getProductSum(rows, "produitC")
    }])
  })
})

module.exports = app
