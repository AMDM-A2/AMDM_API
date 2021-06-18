const db = require('../utils/database.js')
const express = require('express')
const { DateTime } = require('luxon')
const app = express()

function cleanString (t) {
  const tmp = t.replace(/([A-Z])/g, ' $1')
  return tmp.charAt(0).toUpperCase() + tmp.slice(1)
}

/* GET API page. */
/* ignore coverage because test was not detected */
/* istanbul ignore next */
app.get('/data', function (req, res, next) {
  const sql = `
    SELECT idLot,
           libelle,
           MAX(heure) as heure,
           (SELECT valeur
            FROM Capteurs t2
            WHERE t1.libelle = t2.libelle
              AND t1.idLot = t2.idLot
              AND t1.heure = t2.heure
           )          as valeur,
           (SELECT SUM(valeur)
            FROM Capteurs t3
            WHERE t1.libelle = t3.libelle
              AND t1.idLot = t3.idLot
           )          as sum
    FROM Capteurs t1
    GROUP BY idLot, libelle
    UNION
    SELECT idLot,
           "alert"    as libelle,
           MAX(heure) as heure,
           (SELECT description
            FROM Alertes t2
            WHERE t1.idLot = t2.idLot
              AND t1.heure = t2.heure
           )          as valeur,
           count(*)   as sum
    FROM Alertes t1
    GROUP BY idLot, libelle`

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }

    try {
      const lots = {}
      for (const row of rows) {
        const tmp = { ...{}, ...row }
        tmp.libelle = cleanString(tmp.libelle)
        delete tmp.idLot
        lots[row.idLot] && lots[row.idLot].length ? lots[row.idLot].push(tmp) : lots[row.idLot] = [tmp]
      }
      const finalLots = []
      for (const lot in lots) {
        if (req.query.firstDate && req.query.firstDate.length && req.query.lastDate && req.query.lastDate.length) {
          let debut = DateTime.fromISO(req.query.firstDate, { locale: 'fr' })
          let fin = DateTime.fromISO(req.query.lastDate, { locale: 'fr' })
          if (debut > fin) {
            const tmpFin = fin
            fin = debut
            debut = tmpFin
          }

          const dateArray = lots[lot] && lots[lot].length
            ? lots[lot].map(v => DateTime.fromFormat(v.heure.split(' ')[0], 'yyyy-MM-dd', { locale: 'fr' }))
            : []

          for (const date of dateArray) {
            if (date >= debut && date <= fin) {
              finalLots.push({ lotId: lot, data: lots[lot] })
              break
            }
          }
        } else {
          finalLots.push({ lotId: lot, data: lots[lot] })
        }
      }

      return res.json(finalLots.sort((a, b) => a.lotId.localeCompare(b)).splice(0, 300))
    } catch (err) {
      return res.status(500).json({ message: err })
    }
  })
})
/* istanbul ignore next */
app.get('/data/:id', function (req, res, next) {
  const sql = 'SELECT id, heure, libelle, valeur FROM Capteurs WHERE idLot = ? ORDER BY heure'

  // eslint-disable-next-line node/handle-callback-err
  db.all(sql, [req.params.id], (err, rows) => {
    const rettmp = {}
    for (const row of rows) {
      if (rettmp[row.libelle] === undefined) {
        rettmp[row.libelle] = { name: cleanString(row.libelle), data: [] }
      }
      rettmp[row.libelle].data.push([DateTime.fromFormat(row.heure, 'yyyy-MM-dd HH:mm:ss', { locale: 'fr' }).toMillis(), row.valeur])
    }
    const ret = []
    for (const row in rettmp) {
      ret.push(rettmp[row])
    }
    // ret = ret.map(v => v.data.sort((a, b) => DateTime.fromMillis(a[0]) > DateTime.fromMillis(b[0])))
    return res.json(ret.sort((a, b) => a.name.localeCompare(b.name)))
  })
})

module.exports = app
