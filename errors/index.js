const BadRequestError = require('./BadRequest')
const NotFound = require('./NotFound')
const Unauthenticated = require('./Unauthenticated')
const CustomError = require('./CustomError')
const UnauthorizedError = require('./Unauthorized')

module.exports = {
    BadRequestError,
    NotFound,
    Unauthenticated,
    UnauthorizedError,
    CustomError
}

