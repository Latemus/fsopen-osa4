const usersRouter = require('express').Router()
const User = require('./../models/blog')
const bcrypt = require('bcrypt')


usersRouter.get('/', async (request, response) => {
   response.json(await User.find({}))
})

usersRouter.post('/', async (request, response) => {
   const { username, name, password } = request.body

   const saltRounds = 10
   const passwordHash = await bcrypt.hash(password, saltRounds)

   const user = new User( username, name, passwordHash )
   const newUser = await user.save()
   response.status(201).json(newUser)
})

module.exports = usersRouter