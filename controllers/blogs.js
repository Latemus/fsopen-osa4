const blogsRouter = require('express').Router()
const Blog = require('./../models/blog')



blogsRouter.get('/', async (request, response, next) => {
   response.json(await Blog.find({}))
})

blogsRouter.get('/:id', async (request, response, next) => {
   const id = request.params.id
   response.json(await Blog.findById(id))
})

blogsRouter.post('/', async (request, response, next) => {
   const blog = new Blog({ ...request.body, likes: request.body.likes || 0 })
   const newBlog = await blog.save()
   response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
   console.log("asd")
   const id = request.params.id
   await Blog.findByIdAndDelete(id)
   response.status(204).end()
})

module.exports = blogsRouter