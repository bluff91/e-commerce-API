const jwt = require('jsonwebtoken')

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

module.exports = {
    attachCookiesToResponse,
    isTokenValid
}