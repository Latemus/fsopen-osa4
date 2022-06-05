const Blog = require('./../models/blog')
const User = require('../models/user')

const tObjects = {
	blogPosts: [
		{
			title: '1',
			author: 'A',
			url: '/A-1',
			likes: 2,
		},
		{
			title: '2',
			author: 'B',
			url: '/B-2',
			likes: 6,
		},
		{
			title: '3',
			author: 'C',
			url: '/C-3',
			likes: 0,
		},
		{
			title: '4',
			author: 'A',
			url: '/A-4',
			likes: 3,
		},
		{
			title: '5',
			author: 'B',
			url: '/B-5',
			likes: 10,
		},
	],

	validUser: [
		{
			username: 'user1',
			name: 'realName1',
			password: 'Qwertyui1!',
		},
	],

   validUsers: [
		{
			username: 'userA',
			name: 'realNameA',
			password: 'Qwertyui1!',
		},
		{
			username: 'userB',
			name: 'realNameB',
			password: 'Qwertyui1!',
		},
	],

	validNewBlogPost: {
		title: 'title',
		author: 'author',
		url: 'url',
		likes: 1,
	},

	blogPostWithoutLikes: {
		title: 'blogPostWithoutLikes',
		author: 'author',
		url: 'url',
	},
}

const blogsInDb = async () => {
   const blogs = await Blog.find({})
   return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
   const users = await User.find({})
   return users.map(u => u.toJSON())
 }


module.exports = {
	tObjects,
	blogsInDb,
	usersInDb,
}