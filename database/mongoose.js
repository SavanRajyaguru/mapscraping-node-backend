const mongoose = require('mongoose')
const config = require('../config/config')
const { handleCatchError } = require('../helper/utilities.services')

const TfgDatabase = connection(config.DB_URL, parseInt(config.DB_POOLSIZE), 'map_scrape_db')

function connection(DB_URL, maxPoolSize = 10, DB) {
  try {
    let dbConfig = { maxPoolSize, readPreference: 'secondaryPreferred' }
    const conn = mongoose.createConnection(DB_URL, dbConfig)
    conn.on('connected', () => console.log(`Connected to ${DB} database...`))
    conn.on('disconnected', () => console.log(`Disconnected to ${DB} database...`))
    return conn
  } catch (error) {
    handleCatchError(error, 'DB Error')
  }
}

module.exports = {
  TfgDatabase,
}