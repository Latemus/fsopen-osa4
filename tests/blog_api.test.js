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

   test('blog without title and url is not added', async () => {
      await api
         .post('/api/blogs')
         .send({ author: 'A' })
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


afterAll(async () => {
   await Blog.deleteMany({})
   mongoose.connection.close()
})