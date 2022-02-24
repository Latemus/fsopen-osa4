const Blog = require('./../models/blog')

const blogPosts = [
   {
      title: '1',
      author: 'A',
      url: '/A-1',
      likes: 2
   },
   {
      title: '2',
      author: 'B',
      url: '/B-2',
      likes: 6
   },
   {
      title: '3',
      author: 'C',
      url: '/C-3',
      likes: 0
   },
   {
      title: '4',
      author: 'A',
      url: '/A-4',
      likes: 3
   },
   {
      title: '5',
      author: 'B',
      url: '/B-5',
      likes: 10
   },
]

const validNewBlogPost = {
   title: 'title',
   author: 'author',
   url: 'url',
   likes: 1
}

const blogPostWithoutLikes = {
   title: 'blogPostWithoutLikes',
   author: 'author',
   url: 'url'
}

const blogsInDb = async () => {
   const blogs = await Blog.find({})
   return blogs.map(blog => blog.toJSON())
}


module.exports = {
   blogPosts,
   validNewBlogPost,
   blogPostWithoutLikes,
   blogsInDb,
}