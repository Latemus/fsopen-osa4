const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const morgan = require('morgan')
const { connectToDatabase } = require('./utils/mongo.js')
const { PORT } = require('./utils/config')

connectToDatabase()

app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
morgan.token('body-content', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body-content'))

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app