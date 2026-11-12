const mongoose = require('mongoose')
const cloudinary = require('cloudinary')
const env = require('./config/env')
const app = require('./app')
const { seedDemo } = require('./services/demoService')

cloudinary.v2.config(env.cloudinary)

mongoose.connect(env.dbUrl)
  .then(() => {
    console.log('Database connected')
    // make sure the public demo account exists on fresh deployments
    seedDemo().then((n) => n && console.log(`Demo account created (${n} sample transactions)`)).catch((e) => console.error('Demo seed failed:', e.message))
    app.listen(env.port, () => console.log(`API listening on http://localhost:${env.port}`))
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message)
    process.exit(1)
  })
