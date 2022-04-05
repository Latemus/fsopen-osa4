const blogsRouter = require('express').Router()
const Blog = require('./../models/blog')



blogsRouter.get('/', async (request, response) => {
   response.json(await Blog.find({}))
})

blogsRouter.get('/:id', async (request, response) => {
   const id = request.params.id
   response.json(await Blog.findById(id))
})

blogsRouter.post('/', async (request, response) => {
   const blog = new Blog({ ...request.body, likes: request.body.likes || 0 })
   const newBlog = await blog.save()
   response.status(201).json(newBlog)
})

blogsRouter.put('/:id', async (request, response) => {

   const blog = await Blog.findById(request.params.id)
   const updateObject = {
      title: request.body.title, 
      author: request.body.author,
      url: request.body.url 
   }
   blog.set(updateObject)
   await blog.save()

   response.status(200).json(blog)
})

blogsRouter.put('/:id/likes', async (request, response) => {
   const blog = await Blog.findById(request.params.id)
   if (!request.body.likes || request.body.likes < 0) {
      return response.status(400).json({ error: 'likes should be positive integer'})
   }
   const updateObject = { likes: request.body.likes }
   blog.set(updateObject)
   await blog.save()

   response.status(200).json(blog)
})

blogsRouter.delete('/:id', async (request, response) => {
   await Blog.findByIdAndDelete(request.params.id)
   response.status(204).end()
})

module.exports = blogsRouter