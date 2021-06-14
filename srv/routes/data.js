const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.json({ yes: 'oui' })
})

module.exports = app
