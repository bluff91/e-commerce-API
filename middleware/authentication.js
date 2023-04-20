const CustomError = require('../errors')
const { isTokenValid } = require('../utils/utilityFunctions')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new CustomError.Unauthenticated('Authentication invalid')
  }
  try {
    const payload = isTokenValid(token)
    req.user = {
      name: payload.name,
      role: payload.role,
      userId: payload.userId,
    }
  } catch (error) {
    throw new CustomError.Unauthenticated('Authentication invalid')
  }
  next()
}

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError('Forbiden access')
    }
    next()
  }
}

module.exports = { authenticateUser, authorizePermission }
