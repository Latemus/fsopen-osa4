const log = (...params) => {
   console.log(...params)
}

const info = (...params) => {
   console.info(...params)
}

const error = (...params) => {
   console.error(...params)
}

module.exports = {
   log, info, error
}