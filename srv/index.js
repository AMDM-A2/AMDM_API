import express from 'express'

const cors = require('cors')

export default (app) => {
  app.use(express.json())
  app.use(cors())

  app.use('/api/v1', require('./routes/api'))
}
