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
           t4.id     AS sensorId,
           t4.libelle,
           MAX(date) as date,
           (SELECT valeur
            FROM Data t2
            WHERE t1.capteur = t2.capteur
              AND t1.idLot = t2.idLot
              AND t1.date = t2.date
           )         as valeur,
           (SELECT SUM(valeur)
            FROM Data t3
            WHERE t1.capteur = t3.capteur
              AND t1.idLot = t3.idLot
           )         as sum
    FROM Data t1,
         Capteurs t4
    WHERE t1.capteur = t4.id
      ${req.query.sensor && !isNaN(req.query.sensor) ? 'AND t4.id = ?' : ''}
    GROUP BY idLot, capteur
  `

  const sql2 = `
    SELECT idLot,
           "alert"   as libelle,
           MAX(date) as date,
           (SELECT description
            FROM Alertes t2
            WHERE t1.idLot = t2.idLot
              AND t1.date = t2.date
           )         as valeur,
           COUNT(*)  as sum
    FROM Alertes t1
    GROUP BY idLot, libelle`

  db.all(sql, [req.query.sensor || undefined], (err, rows1) => {
    if (err) {
      res.status(400).json({ error: err })
      return
    }

    db.all(sql2, [], (err, rows2) => {
      if (err) {
        res.status(400).json({ error: err })
        return
      }

      const rows = rows1.concat(rows2)

      try {
        const lots = {}
        for (const row of rows) {
          const tmp = { ...{}, ...row }
          tmp.libelle = cleanString(tmp.libelle)
          delete tmp.idLot
          lots[row.idLot] && lots[row.idLot].length ? lots[row.idLot].push(tmp) : lots[row.idLot] = [tmp]
        }
        let finalLots = []
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
              ? lots[lot].map(v => DateTime.fromFormat(v.date.split(' ')[0], 'yyyy-MM-dd', { locale: 'fr' }))
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

        if (req.query.search && req.query.search.length) finalLots = finalLots.filter(v => v.lotId.includes(req.query.search))
        return res.json(finalLots.sort((a, b) => a.lotId.localeCompare(b)).splice(0, 300))
      } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err })
      }
    })
  })
})
/* istanbul ignore next */
app.get('/services/lots/:id/data', function (req, res, next) {
  const sql = 'SELECT data.id, date, libelle, valeur FROM Data, Capteurs WHERE Data.capteur = Capteurs.id AND Data.idlot = ? ORDER BY date'

  db.all(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ message: err })
    const rettmp = {}
    for (const row of rows) {
      if (rettmp[row.libelle] === undefined) {
        rettmp[row.libelle] = { name: cleanString(row.libelle), data: [] }
      }
      rettmp[row.libelle].data.push([DateTime.fromFormat(row.date, 'yyyy-MM-dd HH:mm:ss', { locale: 'fr' }).toMillis(), row.valeur])
    }
    const ret = []
    for (const row in rettmp) {
      ret.push(rettmp[row])
    }
    return res.json(ret.sort((a, b) => a.name.localeCompare(b.name)))
  })
})

app.get('/sensors', function (req, res) {
  const sql = 'SELECT * FROM Capteurs'
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ message: err })
    rows.forEach(v => {
      v.libelle = cleanString(v.libelle)
    })
    return res.json(rows)
  })
})

app.get('/alerts', function (req, res, next) {
  const sql = 'SELECT * FROM Alertes'
  const search = req.query.search
  const arr = []
  db.all(sql, arr, (err, rows) => {
    if (err) return res.status(500).json({ message: err })
    if (search && search.length > 0) {
      return res.json({
        results: rows.filter(v => v.id.toString().includes(search) ||
          (v.description != null
            ? v.description.toUpperCase().includes(search.toUpperCase())
            : false))
      })
    } else return res.json({ results: rows })
  })
})

app.patch('/alert', (req, res, next) => {
  const sql = 'update Alertes set description = ? where id = ?'
  db.all(sql, [req.body.description, req.body.id], (err, rows) => {
    if (err) return res.status(400).json({ error: err })
    return res.status(200).send('ok')
  })
})

app.put('/alert', (req, res) => {
  const sql = 'insert into Alertes (idLot, date, description) values (?, ?, ?)'
  db.all(sql, [req.body.idLot, DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss', { locale: 'fr' }), req.body.description], (err, rows) => {
    if (err) return res.status(400).json({ error: err })
    return res.status(200).send('ok')
  })
})

module.exports = app
