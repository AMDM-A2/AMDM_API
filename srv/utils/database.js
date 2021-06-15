const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = 'db.db'

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to the SQLite database.')
    // create table if not exist
    db.run(`CREATE TABLE "Gestion"
            (
              "id"          INTEGER NOT NULL UNIQUE,
              "identifiant" TEXT    NOT NULL,
              "numeroLot"   INTEGER NOT NULL,
              "hour"        TEXT    NOT NULL,
              "valeur"      INTEGER NOT NULL,
              PRIMARY KEY ("id" AUTOINCREMENT)
            );`,
    (err) => {})
  }
})

module.exports = db
