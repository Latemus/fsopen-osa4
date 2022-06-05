const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('./../models/blog')
const User = require('./../models/user')

const { newValidationError } = require('./../utils/mongo')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { id: 1 })
	response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
	const id = request.params.id
	response.json(await Blog.findById(id).populate('user', { id: 1 }))
})

blogsRouter.post('/', async (request, response) => {
	const userId = request.body.userId
	if (!userId) {
		throw newValidationError('userId', 'userId required')
	}
	const user = await User.findById(userId)
	if (!user) {
		throw newValidationError('userId', 'no user found with given id')
	}

	const blog = new Blog({
		...request.body,
		likes: 0,
		user: user._id,
	})
	const newBlog = await blog.save()
	user.blogs = user.blogs.concat(newBlog._id)
	await user.save()
	response.status(201).json(newBlog)
})

blogsRouter.put('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	const updateObject = {
		title: request.body.title,
		url: request.body.url,
	}
	blog.set(updateObject)
	await blog.save()

	response.status(200).json(blog)
})

blogsRouter.put('/:id/likes', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	if (!request.body.likes || request.body.likes < 0) {
		return response.status(400).json({ error: 'likes should be positive integer' })
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
