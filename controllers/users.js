const usersRouter = require('express').Router()
const User = require('./../models/user')
const bcrypt = require('bcrypt')
const { MissingPropertyError, DuplicateUserNameError } = require('../utils/errors')


usersRouter.get('/', async (request, response) => {
   response.json(await User.find({}))
})

usersRouter.post('/', async (request, response) => {
   const { username, name, password } = request.body
   if (!username) throw new MissingPropertyError('username')
   if (!password) throw new MissingPropertyError('password')

   await checkUsernameToBeUnique(username)

   const saltRounds = 10
   const passwordHash = await bcrypt.hash(password, saltRounds)

   const user = new User({ username, name, passwordHash })
   const newUser = await user.save()
   response.status(201).json(newUser)
})

const checkUsernameToBeUnique = async username => {
   // Check that usename is unique
   const foundUser = await User.find({ username })
   if (foundUser?.length > 0) {
      throw new DuplicateUserNameError(username)
   }
}

module.exports = usersRouter