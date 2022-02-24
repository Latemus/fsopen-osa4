require('dotenv').config()

let DB_CONNECTION_URL = process.env.DB_CONNECTION_URL

module.exports = {
  DB_CONNECTION_URL,
}