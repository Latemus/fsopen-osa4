const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { newValidationError } = require('./../utils/mongo')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10
const PASSWORD_MIN_LENGTH = 3
const USERNAME_MIN_LENGTH = 3

const userSchema = mongoose.Schema({
	username: {
		type: String,
		minlength: [USERNAME_MIN_LENGTH, `Username is too short. Minimun length is ${PASSWORD_MIN_LENGTH}`],
		unique: true,
		uniqueCaseInsensitive: true,
		required: true,
	},
	name: String,
	password: {
		type: String,
		minlength: [PASSWORD_MIN_LENGTH, `Password is too short. Minimun length is ${PASSWORD_MIN_LENGTH}`],
		required: true,
		select: false,
	},
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog',
		},
	],
})

/**
 * Before saving password is hashed
 *
 * @param {*} password
 * @returns
 */
userSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		return next()
	}
	this.password = bcrypt.hashSync(this.password, SALT_ROUNDS)
	return next()
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.password // Shoudld not be returned
	},
})

/**
 * Compare supplied password with user's own (hashed) password
 * NOTE! Asyncronous
 *
 * @param {string} password password to be hashed
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = (password) => bcrypt.compareSync(password, this.password)

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)
module.exports = User
