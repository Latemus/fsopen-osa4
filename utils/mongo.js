const mongoose = require('mongoose')
const config = require('./config')
const logger = require('./../utils/logger')
require('dotenv').config()

const connectToDatabase = () => {
   // Do nothing if connection alredy ok
   if (!mongoose.connection || mongoose.connection.readyState === 0) {
      mongoose.connect(config.DB_CONNECTION_URL).then(() => {
         logger.info('Successfully connected to the database')
         mongoose.connection.on('error', error => handleDatabaseError(error))
      }).catch(error => {
         handleDatabaseError(error)
         process.exit()
      })
   }
}

const handleDatabaseError = error => {
   logger.error('Error with Mongo database:', error)
}

module.exports = { connectToDatabase }