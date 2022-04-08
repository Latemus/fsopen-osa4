const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10
const PASSWORD_MIN_LENGTH = 3
const USERNAME_MIN_LENGTH = 3

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: USERNAME_MIN_LENGTH,
    unique: true,
    uniqueCaseInsensitive: true
  },
  name: String,
  password: {
    type: String,
    required: true,
    minlength: PASSWORD_MIN_LENGTH,
    set: passwordSetter
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

function passwordSetter(password) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return undefined
  }
  return bcrypt.hashSync(password, SALT_ROUNDS)
}

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password // Shoudld not be returned
  }
})

/**
 * Compare supplied password with user's own (hashed) password
 * NOTE! Asyncronous
 *
 * @param {string} password password to be hashed
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = password => bcrypt.compareSync(password, this.password)

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema)
module.exports = User