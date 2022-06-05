const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const bcrypt = require('bcrypt')
const { users, usersInDb } = require('./test_helper')

beforeEach(async () => {
	await User.deleteMany({})
	await User.insertMany(users)
})

afterAll(async () => {
	await User.deleteMany({})
	mongoose.connection.close()
})

describe('generig tests', () => {
	test('response content-type is json', async () => {
		await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})
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

		const usernames = usersAtEnd.map((u) => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await usersInDb()

		const newUser = {
			username: usersAtStart[0].username,
			name: usersAtStart[0].name,
			password: users[0].password,
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error?.username).toContain('Error, expected `username` to be unique')

		const usersAtEnd = await usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})

	test('creation fails with proper statuscode and message if constraints are not met', async () => {
		const usersAtStart = await usersInDb()

		const testCases = [
			{
				user: {},
				errorToContain: {
					password: 'Path `password` is required.',
					username: 'Path `username` is required.',
				},
			},
			{
				user: { username: 'a' },
				errorToContain: {
					password: 'Path `password` is required.',
					username: 'Username is too short. Minimun length is 3',
				},
			},
			{
				user: { username: 'asd' },
				errorToContain: {
					password: 'Path `password` is required.',
				},
			},
			{
				user: { password: 'a' },
				errorToContain: {
					password: 'Password is too short. Minimun length is 3',
					username: 'Path `username` is required.',
				},
			},
			{
				user: { password: 'asd' },
				errorToContain: {
					username: 'Path `username` is required.',
				},
			},
			{
				user: { password: 'a', username: 'a' },
				errorToContain: {
					password: 'Password is too short. Minimun length is 3',
					username: 'Username is too short. Minimun length is 3',
				},
			},
			{
				user: { password: 'asd', username: 'a' },
				errorToContain: {
					username: 'Username is too short. Minimun length is 3',
				},
			},
			{
				user: { password: 'a', username: 'asd' },
				errorToContain: {
					password: 'Password is too short. Minimun length is 3',
				},
			},
		]

		for (let testCase of testCases) {
			const result = await api.post('/api/users').send(testCase.user).expect(400)
			expect(result.body.error).toMatchObject(testCase.errorToContain)
		}
	})
})

