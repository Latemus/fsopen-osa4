
const totalLikes = blogs => {
   return blogs.map(blog => blog?.likes || 0).reduce((prev, current) => prev + current, 0)
}

const favoriteBlog = blogs => {
   return blogs?.reduce((prev, current) => prev?.likes > (current?.likes || 0) ? prev : current, null)
}

const mostLikes = blogs => {
   if (!blogs || blogs.length === 0) return null

   const authors = [...new Set(blogs.map(b => b.author))]
   let authorWithMostLikes = { author: '', likes: 0 }
   authors.forEach(author => {
      const authorsBlogs = blogs.filter(blog => blog.author === author)
      const authorsLikes = authorsBlogs.map(blog => blog.likes).reduce((prev, current) => prev + current, 0)
      if (authorsLikes > authorWithMostLikes.likes) {
         authorWithMostLikes = { author: author, likes: authorsLikes }
      }
   })
   return authorWithMostLikes
}

const mostBlogs = blogs => {
   if (!blogs || blogs.length === 0) return null

   const authors = [...new Set(blogs.map(b => b.author))]
   let authorWithMostBlogs = { author: '', blogs: 0 }
   authors.forEach(author => {
      const authorsBlogs = blogs.filter(blog => blog.author === author)
      if (authorsBlogs.length > authorWithMostBlogs.blogs) {
         authorWithMostBlogs = { author: author, blogs: authorsBlogs.length }
      }
   })
   return authorWithMostBlogs
}

module.exports = {
   totalLikes,
   favoriteBlog,
   mostLikes,
   mostBlogs
}