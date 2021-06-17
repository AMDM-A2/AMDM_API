const db = require('../utils/database.js')
const express = require('express')
const app = express()

/* GET API page. */
app.get('/data', function (req, res, next) {
  /* ignore coverage because test was not detected */
  /* istanbul ignore next */
  const sql = `
    SELECT numeroLot,
           typeProduit,
           MAX(heure) as heure,
           (SELECT valeur
            FROM Produits t2
            WHERE t1.typeProduit = t2.typeProduit
              AND t1.numeroLot = t2.numeroLot
              AND t1.heure = t2.heure
           )          as valeur,
           (SELECT SUM(valeur)
            FROM Produits t3
            WHERE t1.typeProduit = t3.typeProduit
              AND t1.numeroLot = t3.numeroLot
           )          as sum
    FROM Produits t1
    GROUP BY numeroLot, typeProduit
    UNION
    SELECT numeroLot,
           "alert"    as typeProduit,
           MAX(heure) as heure,
           (SELECT valeur
            FROM Alertes t2
            WHERE t1.numeroLot = t2.numeroLot
              AND t1.heure = t2.heure
           )          as valeur,
           (SELECT SUM(valeur)
            FROM Alertes t3
            WHERE t1.numeroLot = t3.numeroLot
           )          as sum
    FROM Alertes t1
    GROUP BY numeroLot, typeProduit`

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }

    const lots = {}
    for (const row of rows) {
      const tmp = { ...{}, ...row }
      tmp.typeProduit = tmp.typeProduit.replace(/([A-Z])/g, ' $1')
      tmp.typeProduit = tmp.typeProduit.charAt(0).toUpperCase() + tmp.typeProduit.slice(1)
      delete tmp.numeroLot
      lots[row.numeroLot] && lots[row.numeroLot].length ? lots[row.numeroLot].push(tmp) : lots[row.numeroLot] = [tmp]
    }
    const finalLots = []
    for (const lot in lots) {
      finalLots.push({ lotId: lot, data: lots[lot] })
    }
    return res.json(finalLots.splice(0, 100))
  })
})

module.exports = app
