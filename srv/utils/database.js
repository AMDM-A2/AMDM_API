const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = 'db.db'

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    // create table if not exist
    db.run(`
      CREATE TABLE "Lots" (
          "id"    INTEGER,
          "description"    TEXT,
          PRIMARY KEY("id")
      );
      CREATE TABLE "Alertes" (
          "id"    INTEGER,
          "idLot"    INTEGER NOT NULL,
          "date"    DATETIME NOT NULL,
          "description"    TEXT,
          PRIMARY KEY("id"),
          FOREIGN KEY("idLot") REFERENCES "Lots"("id")
      );

      CREATE TABLE "Capteurs" (
          "id"    INTEGER,
          "libelle"    TEXT NOT NULL,
          "description"    TEXT,
          PRIMARY KEY("id")
      );
      CREATE TABLE "Data" (
          "id"    INTEGER,
          "idLot"    INTEGER NOT NULL,
      "capteur"    INTEGER NOT NULL,
          "date"    DATETIME NOT NULL,
          "valeur"    INTEGER NOT NULL,
          PRIMARY KEY("id"),
          FOREIGN KEY("idLot") REFERENCES Lots(id),
      FOREIGN KEY("capteur") REFERENCES Capteurs(id)
      );`,
    // eslint-disable-next-line node/handle-callback-err
    (err) => {})
  }
})

module.exports = db
