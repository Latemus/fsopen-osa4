const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const bcrypt = require('bcrypt')
const { usersInDb } = require('./test_helper')

beforeEach(async () => {
   await User.deleteMany({})
   const user = new User({ username: 'root', password: 'password' })
   await user.save()
})

describe('when there is initially one user at db', () => {

 
   test('creation succeeds with a fresh username', async () => {
     const usersAtStart = await usersInDb()
 
     const newUser = {
       username: 'newUsername',
       name: 'name',
       password: 'Qwertyui1!',
     }
 
     await api
       .post('/api/users')
       .send(newUser)
       .expect(201)
       .expect('Content-Type', /application\/json/)
 
     const usersAtEnd = await usersInDb()
     expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
 
     const usernames = usersAtEnd.map(u => u.username)
     expect(usernames).toContain(newUser.username)
   })

   test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await usersInDb()
  
      const newUser = {
        username: usersAtStart[0].username,
        name: usersAtStart[0].name,
        password: usersAtStart[0].password,
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('username: Error, expected `username` to be unique')
  
      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
   })
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})