const { MissingPropertyError } = require('./errors')

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	console.log(error)
	// 400
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	if (error.name === 'ValidationError') {
		let errors = {}
		Object.keys(error.errors).forEach((key) => (errors[key] = error.errors[key].message))
		return response.status(400).json({ error: errors })
	}
	if (error instanceof MissingPropertyError) {
		return response.status(400).json({ error: error.message })
	}
	if (error.name === 'TypeError') {
		return response.status(400).json({ error: error.message })
	}

	// 401
	if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: 'invalid token' })
	}

	// Uncaugth error
	console.error(`[ERROR] ${error.name}: ${error.message}`)
	next(error)
}

module.exports = { unknownEndpoint, errorHandler }
