// Usage: npm run seed   ->  resets demo@example.com / Demo@12345 with fresh sample data
const mongoose = require('mongoose')
const env = require('../config/env')
const { seedDemo, DEMO } = require('../services/demoService')

mongoose.connect(env.dbUrl)
  .then(() => seedDemo({ force: true }))
  .then((n) => console.log(`Seeded ${n} transactions for ${DEMO.email} (password: ${DEMO.password})`))
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => mongoose.disconnect())
