const { MissingPropertyError } = require('./errors')

const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
   // 400
   if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
   }
   else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
   }
   else if (error instanceof MissingPropertyError) {
      return response.status(400).json({ error: error.message })
   }
   // 404
   else if (error.name === 'TypeError' && error.message === 'Cannot read property \'set\' of null') {
      return response.status(404).json({ error: 'not found' })
   } 
   // 401
   else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'invalid token' })
   }
   // Uncaugth error
   else {
      console.error(`[ERROR] ${error.name}: ${error.message}`)
   }

   next(error)
}

module.exports = { unknownEndpoint, errorHandler }