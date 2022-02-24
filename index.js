// const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { connectToDatabase } = require('./utils/mongo.js')

const blogSchema = mongoose.Schema({
   title: String,
   author: String,
   url: String,
   likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

connectToDatabase()

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
   Blog
      .find({})
      .then(blogs => {
         response.json(blogs)
      })
})

app.post('/api/blogs', (request, response) => {
   const blog = new Blog(request.body)

   blog
      .save()
      .then(result => {
         response.status(201).json(result)
      })
})

const PORT = 3003
app.listen(PORT, () => {
   console.info(`Server running on port ${PORT}`)
})