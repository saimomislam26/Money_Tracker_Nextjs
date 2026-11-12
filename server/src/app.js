const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const env = require('./config/env')
const routes = require('./routes')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const app = express()
app.use(helmet())
app.use(cors({ origin: env.clientUrls, credentials: true }))
app.use(express.json({ limit: '1mb' }))
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))

app.get('/', (_req, res) => res.json({ name: 'Money Tracker API', status: 'ok' }))
app.use('/api', routes)
app.use(notFound)
app.use(errorHandler)

module.exports = app
