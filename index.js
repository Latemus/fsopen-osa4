// const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const morgan = require('morgan')
const { connectToDatabase } = require('./utils/mongo.js')



connectToDatabase()

app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
morgan.token('body-content', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body-content'))

app.get('/', (req, res) => {
   res.send(`asd`)
 })

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = 3003
app.listen(PORT, () => {
   logger.info(`Server running on port ${PORT}`)
})