const jwt = require('jsonwebtoken')
const CustomError = require('../errors')

const attachCookiesToResponse = (createdToken ,res ) => {
    res.cookie('token', createdToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000*60*60*24),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    })
}

const isTokenValid = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

const createTokenUser = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {expiresIn:process.env.JWT_TOKE_VALIDITY})
}

const checkPermissions = (requestUser, resourceUserId) => {
    console.log('req.user.userId=', requestUser, 'review.user=', resourceUserId)
    if (requestUser.role === 'admin') return
    if (requestUser.userId === resourceUserId.toString()) return
    throw new CustomError.UnauthorizedError("Acces Forbidden")
} 


module.exports = {
    attachCookiesToResponse,
    isTokenValid,
    createTokenUser,
    checkPermissions
}