require('dotenv').config()

const PORT = process.env.PORT || 3001

const DB_CONNECTION_URL = process.env.NODE_ENV === 'test'
   ? process.env.DB_CONNECTION_URL
   : process.env.DB_TEST_CONNECTION_URL

module.exports = {
   DB_CONNECTION_URL,
   PORT
}