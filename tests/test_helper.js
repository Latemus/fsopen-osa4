const Blog = require('./../models/blog')
const User = require('./../models/user')

module.exports.users = [
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
]

module.exports.blogs = [
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
]

module.exports.validUser = {
	username: 'testUser',
	name: 'testUsers name',
	password: 'Qwertyui1!',
}

module.exports.blogWithValidUser = async () => {
	let user = (await User.find({ username: this.validUser.username })[0]) || null
	if (!user) {
		user = await new User(this.validUser).save()
	}
	return {
		userId: user._id.toString(),
		title: 'title',
		author: 'author',
		url: 'url',
		likes: 10,
	}
}

module.exports.blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map((blog) => blog.toJSON())
}

module.exports.usersInDb = async () => {
	const users = await User.find({})
	return users.map((user) => user.toJSON())
}