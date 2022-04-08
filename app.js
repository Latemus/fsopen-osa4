const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const morgan = require('morgan')
const { connectToDatabase } = require('./utils/mongo.js')

connectToDatabase()

app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
morgan.token('body-content', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body-content'))

// Routes
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app