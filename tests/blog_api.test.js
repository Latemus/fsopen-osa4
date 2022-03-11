const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('./../models/blog')
const api = supertest(app)
const { blogPosts, validNewBlogPost, blogPostWithoutLikes, blogsInDb } = require('./test_helper')

beforeEach(async () => {
   await Blog.deleteMany({})
   for (const blogPost of blogPosts) {
      await (new Blog(blogPost)).save()
   }
})

describe('generig tests', () => {
   test('response content-type is json', async () => {
      await api
         .get('/api/blogs')
         .expect(200)
         .expect('Content-Type', /application\/json/)
   })
})

describe('GET all - /blogs', () => {
   test(`there are ${blogPosts.length} notes`, async () => {
      const res = await api.get('/api/blogs')
      expect(res.body).toHaveLength(blogPosts.length)
   })
   test(`the first note's title is '${blogPosts[0].title}'`, async () => {
      const res = await api.get('/api/blogs')
      expect((res.body)[0].title).toBe(blogPosts[0].title)
   })
   test(`list of blogPosts contains a post with url: '${blogPosts[4].url}'`, async () => {
      const urls = (await api.get('/api/blogs')).body.map(blog => blog.url)
      expect(urls).toContain(blogPosts[4].url)
   })
   test('returned blogs have a \'id\' attribute', async () => {
      const blogs = await api.get('/api/blogs')
      console.log(blogs.body)
      expect(blogs.body[0].id).toBeDefined()

   })
})


describe('POST blogPost - /blogs', () => {
   test('valid blog post is added and blog posts list is 1 longer than before', async () => {
      await api
         .post('/api/blogs')
         .send(validNewBlogPost)
         .expect(201)
         .expect('Content-Type', 'application/json; charset=utf-8')

      const blogs = await blogsInDb()
      const titles = blogs.map(blog => blog.title)

      expect(blogs).toHaveLength(blogPosts.length + 1)
      expect(titles).toContain(validNewBlogPost.title)
   })

   test('blog with title and url is added', async () => {
      await api
         .post('/api/blogs')
         .send({ title: 'A', url: 'B' })
         .expect(201)

      expect(await blogsInDb()).toHaveLength(blogPosts.length + 1)
   })

   test('blog without title is not added', async () => {
      await api
         .post('/api/blogs')
         .send({ 
            author: 'A',
            url: '/A-1',
            likes: 1 
         })
         .expect(400)

      expect(await blogsInDb()).toHaveLength(blogPosts.length)
   })

   test('blog without url is not added', async () => {
      await api
         .post('/api/blogs')
         .send({
            title: '1',
            author: 'A',
            likes: 1 
         })
         .expect(400)

      expect(await blogsInDb()).toHaveLength(blogPosts.length)
   })

   test('if likes is not defined, it is set to 0 and blog is saved', async () => {
      const newBlog = await api
         .post('/api/blogs')
         .send(blogPostWithoutLikes)
         .expect(201)

      const blogs = await blogsInDb()
      expect(blogs).toHaveLength(blogPosts.length + 1)
      expect(newBlog.body.likes).toBe(0)
      expect(blogs.map(blog => blog.title)).toContain(blogPostWithoutLikes.title)
   })
})

describe('DELETE blogs - /blogs:id', () => {
   test('if blog exists with given id, it is deleted from the db', async () => {
      const blogs = await blogsInDb()
      await api
         .delete(`/api/blogs/${blogs[0].id}`)
         .expect(204)

      const blogsAfterDelete = await blogsInDb()
      expect(blogsAfterDelete).toHaveLength(blogs.length - 1)
   })

   test('if blog dows not exist with given id, nothing happens', async () => {
      const blogs = await blogsInDb()
      const mockId = 'microsoft123' // Valid MongoDb Id
      await api
         .delete(`/api/blogs/${mockId}`)
         .expect(204)
      const blogsAfterDelete = await blogsInDb()
      expect(blogsAfterDelete).toHaveLength(blogs.length)
   })

   test('if unvalid id is given, returns res 400 - bad request', async () => {
      const mockId = '-1'
      await api
         .delete(`/api/blogs/${mockId}`)
         .expect(400)
   })
})


afterAll(async () => {
   await Blog.deleteMany({})
   mongoose.connection.close()
})