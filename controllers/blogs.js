const blogsRouter = require('express').Router()
const Blog = require('./../models/blog')



blogsRouter.get('/', async (request, response, next) => {
   response.json(await Blog.find({}))
})

blogsRouter.post('/', async (request, response, next) => {
   const blog = new Blog({ ...request.body, likes: request.body.likes || 0 })
   const newBlog = await blog.save()
   response.status(201).json(newBlog)
})


module.exports = blogsRouter