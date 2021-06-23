import express from 'express'

const cors = require('cors')

export default (app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors())
  app.use('/api/v1', require('./routes/api'))
  app.use('/api/v1/lot', require('./routes/lot'))
  // app.use('/api/v1/data', require('./routes/data'))
}
