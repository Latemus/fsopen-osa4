class MissingPropertyError extends Error {
   constructor(missingProperty) {
      super()
      this.name = this.constructor.name
      this.message = `Expected to find property '${missingProperty}' in request body`
      Error.captureStackTrace(this, this.constructor)
   }
}

class DuplicateUserNameError extends Error {
   constructor(username) {
      super()
      this.name = this.constructor.name
      this.message = `Username must be unique. Username '${username}' is allready in use`
      Error.captureStackTrace(this, this.constructor)
   }
}

module.exports = {
   MissingPropertyError,
   DuplicateUserNameError
}