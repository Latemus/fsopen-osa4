const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('./../models/blog')
const User = require('./../models/user')
const { blogs, users, blogsInDb, blogWithValidUser, usersInDb } = require('./test_helper')

const getRandomInt = (max = 1000) => Math.floor(Math.random() * (max + 1))

afterAll(async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})
	mongoose.connection.close()
})

describe('generig tests', () => {
	test('response content-type is json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})
	test('blogs have id-property', async () => {
		await Blog.insertMany(blogs)
		const res = await api.get('/api/blogs')
		expect(res.body.length > 0)
		expect(res.body[0].id).toBeDefined()
	})
})



describe('GET all - /blogs', () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		await Blog.insertMany(blogs)
	})

	test(`there are ${blogs.length} blogs`, async () => {
		const res = await api.get('/api/blogs')
		expect(res.body).toHaveLength(blogs.length)
	})
	test(`the first note's title is '${blogs[0].title}'`, async () => {
		const res = await api.get('/api/blogs')
		expect(res.body[0].title).toBe(blogs[0].title)
	})
	test(`list of blogs contains a post with url: '${blogs[4].url}'`, async () => {
		const urls = (await api.get('/api/blogs')).body.map((blog) => blog.url)
		expect(urls).toContain(blogs[4].url)
	})
	test("returned blogs have a 'id' attribute", async () => {
		const blogs = await api.get('/api/blogs')
		expect(blogs.body[0].id).toBeDefined()
	})
})

describe('POST blogPost - /blogs', () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		await User.deleteMany({})
		for (const blogPost of blogs) {
			await new Blog(blogPost).save()
		}
	})
	
	test('valid blog post is added and blog posts list is 1 longer than before', async () => {
		const validNewBlogPost = await blogWithValidUser()
		await api
			.post('/api/blogs')
			.send(validNewBlogPost)
			.expect(201)
			.expect('Content-Type', 'application/json; charset=utf-8')

		const blogsAfterAddition = await blogsInDb()
		const titles = blogsAfterAddition.map((blog) => blog.title)

		expect(blogsAfterAddition).toHaveLength(blogs.length + 1)
		expect(titles).toContain(validNewBlogPost.title)
	})

	test('blog without title is not added', async () => {
		await api
			.post('/api/blogs')
			.send({
				author: 'A',
				url: '/A-1',
				likes: 1,
				userId: "asd"
			})
			.expect(400)

		expect(await blogsInDb()).toHaveLength(blogs.length)
	})

	test('blog without url is not added', async () => {
		await api
			.post('/api/blogs')
			.send({
				title: '1',
				author: 'A',
				likes: 1,
			})
			.expect(400)

		expect(await blogsInDb()).toHaveLength(blogs.length)
	})

	test('if likes is not defined, it is set to 0 and blog is saved', async () => {
		const blogPostWithoutLikes = {
			title: 'blogPostWithoutLikes',
			author: 'author',
			url: 'url',
		}
		const newBlog = await api.post('/api/blogs').send(blogPostWithoutLikes).expect(201)

		const blogs = await blogsInDb()
		expect(blogs).toHaveLength(blogs.length + 1)
		expect(newBlog.body.likes).toBe(0)
		expect(blogs.map((blog) => blog.title)).toContain(blogPostWithoutLikes.title)
	})
})

// describe('DELETE blogs - /blogs:id', () => {
// 	test('if blog exists with given id, it is deleted from the db', async () => {
// 		await api.delete(`/api/blogs/${blogs[0].id}`).expect(204)

// 		const blogsAfterDelete = await blogsInDb()
// 		expect(blogsAfterDelete).toHaveLength(blogs.length - 1)
// 	})

// 	test('if blog does not exist with given id, nothing happens', async () => {
// 		const mockId = 'microsoft123' // Valid MongoDb Id
// 		await api.delete(`/api/blogs/${mockId}`).expect(204)
// 		const blogsAfterDelete = await blogsInDb()
// 		expect(blogsAfterDelete).toHaveLength(blogs.length)
// 	})

// 	test('if unvalid id is given, returns res 400 - bad request', async () => {
// 		const mockId = '-1'
// 		await api.delete(`/api/blogs/${mockId}`).expect(400)
// 	})
// })

// describe('PUT blogs - /blogs:id', () => {
// 	describe('Update blog content', () => {
// 		test('if blog exists and body is valid, blog is updated', async () => {
// 			const updateObject = {
// 				title: 'udpated title',
// 			}
// 			const modifiedBlog = { ...blogs[0], ...updateObject }

// 			const updatedBlog = await api
// 				.put(`/api/blogs/${blogs[0].id}`)
// 				.send(modifiedBlog)
// 				.expect(200)
// 				.expect('Content-Type', 'application/json; charset=utf-8')

// 			expect(updatedBlog.body).toMatchObject(updateObject)
// 		})

// 		test('only title, author and url can be modified. Id and likes remain same, even if given', async () => {
// 			const updateObject = {
// 				title: 'udpated title',
// 				author: 'updated author',
// 				url: 'updated url',
// 				id: 'microsoft123',
// 				likes: 10000,
// 			}
// 			const modifiedBlog = { ...blogs[0], ...updateObject }

// 			const updatedBlog = await api
// 				.put(`/api/blogs/${blogs[0].id}`)
// 				.send(modifiedBlog)
// 				.expect(200)
// 				.expect('Content-Type', 'application/json; charset=utf-8')

// 			expect(updatedBlog.body.title).toBe(updateObject.title)
// 			expect(updatedBlog.body.author).toBe(updateObject.author)
// 			expect(updatedBlog.body.url).toBe(updateObject.url)
// 			// Blogs id and likes should not have changed
// 			expect(updatedBlog.body.id).toBe(blogs[0].id)
// 			expect(updatedBlog.body.likes).toBe(blogs[0].likes)
// 		})

// 		test('if blog does not exist with given id, 404 is returned', async () => {
// 			const mockId = 'microsoft123' // Valid MongoDb Id
// 			await api.put(`/api/blogs/${mockId}`).expect(404)
// 		})

// 		test('if id id invalid, 400 bad request is returned', async () => {
// 			const mockId = '-1'
// 			await api.put(`/api/blogs/${mockId}`).expect(400)
// 		})
// 	})

// 	describe('Update blogs likes', () => {
// 		test('if blog exists and body is valid, blogs likes are updated', async () => {
// 			const updateObject = {
// 				likes: getRandomInt(),
// 			}
// 			const modifiedBlog = { ...blogs[0], ...updateObject }

// 			const updatedBlog = await api
// 				.put(`/api/blogs/${blogs[0].id}/likes`)
// 				.send(modifiedBlog)
// 				.expect(200)
// 				.expect('Content-Type', 'application/json; charset=utf-8')

// 			expect(updatedBlog.body).toMatchObject(updateObject)
// 		})

// 		test('only likes are updated', async () => {
// 			const updateObject = {
// 				title: 'udpated title',
// 				author: 'updated author',
// 				url: 'updated url',
// 				id: 'microsoft123',
// 				likes: getRandomInt(),
// 			}
// 			const modifiedBlog = { ...blogs[0], ...updateObject }

// 			const updatedBlog = await api
// 				.put(`/api/blogs/${blogs[0].id}/likes`)
// 				.send(modifiedBlog)
// 				.expect(200)
// 				.expect('Content-Type', 'application/json; charset=utf-8')

// 			expect(updatedBlog.body.title).toBe(blogs[0].title)
// 			expect(updatedBlog.body.author).toBe(blogs[0].author)
// 			expect(updatedBlog.body.url).toBe(blogs[0].url)
// 			expect(updatedBlog.body.likes).toBe(modifiedBlog.likes)
// 		})

// 		test('if blog does not exist with given id, 404 is returned', async () => {
// 			const mockId = 'microsoft123' // Valid MongoDb Id
// 			await api.put(`/api/blogs/${mockId}/likes`).expect(400)
// 		})

// 		test('if id id invalid, 400 bad request is returned', async () => {
// 			const mockId = '-1'
// 			await api.put(`/api/blogs/${mockId}/likes`).expect(400)
// 		})

// 		test('if likes is negative, 400 bad request is returned', async () => {
// 			const updateObject = {
// 				likes: getRandomInt() * -1,
// 			}
// 			const modifiedBlog = { ...blogs[0], ...updateObject }
// 			await api.put(`/api/blogs/${blogs[0].id}/likes`).send(modifiedBlog).expect(400)
// 		})
// 	})
// })