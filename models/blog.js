const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: false,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	url: {
		type: String,
		required: true,
	},
	likes: {
		type: Number,
		required: false,
	},
})

blogSchema.set('toJSON', {
	transform: (document, returnObject) => {
		returnObject.id = returnObject._id.toString()
		returnObject.user = returnObject.user?.id?.toString() ?? null
		delete returnObject._id
		delete returnObject.__v
	},
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
