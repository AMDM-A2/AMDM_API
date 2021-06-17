const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = 'db.db'

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    // create table if not exist
    db.run(`CREATE TABLE "TypesProduits" (
        "id"    INTEGER,
        "libelle"    TEXT UNIQUE,
        PRIMARY KEY("id")
    );

    CREATE TABLE "Alertes" (
        "id"    INTEGER,
        "numeroLot"    INTEGER NOT NULL,
        "heure"    datetime NOT NULL,
        "valeur"    INTEGER,
        PRIMARY KEY("id"),
        FOREIGN KEY("numeroLot") REFERENCES "Lots"("id")
    );

    CREATE TABLE "Lots" (
        "id"    INTEGER,
        "description"    TEXT,
        PRIMARY KEY("id")
    );

    CREATE TABLE "Produits" (
        "id"    INTEGER,
        "typeProduit"    INTEGER NOT NULL,
        "numeroLot"    INTEGER NOT NULL,
        "heure"    datetime NOT NULL,
        "valeur"    INTEGER NOT NULL,
        FOREIGN KEY("typeProduit") REFERENCES TypesProduits(id),
        FOREIGN KEY("numeroLot") REFERENCES Lots(id),
        PRIMARY KEY("id")
    );`,
    // eslint-disable-next-line node/handle-callback-err
    (err) => {})
  }
})

module.exports = db
