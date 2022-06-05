const usersRouter = require('express').Router()
const User = require('./../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
	response.json(await User.find({}).populate('blogs'))
})

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body

	const user = new User({ username, name, password })
	const newUser = await user.save()
	response.status(201).json(newUser)
})

module.exports = usersRouter
