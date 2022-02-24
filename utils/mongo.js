const mongoose = require('mongoose')
require('dotenv').config()

const connectToDatabase = () => {
   // Do nothing if connection alredy ok
   if (!mongoose.connection || mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.DB_CONNECTION_URL).then(() => {
         console.info('Successfully connected to the database')
         mongoose.connection.on('error', error => handleDatabaseError(error))
      }).catch(error => {
         handleDatabaseError(error)
         process.exit()
      })
   }
}

const handleDatabaseError = error => {
   console.error('Error with Mongo database:', error)
}

module.exports = { connectToDatabase }