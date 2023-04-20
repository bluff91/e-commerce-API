const User = require('../models/User')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const bcryptjs = require('bcryptjs')
const {
  attachCookiesToResponse,
  isTokenValid,
} = require('../utils/utilityFunctions')

const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  const user = await User.create({ name, email, password })
  const createdToken = user.generateToken()
  // the code bellow was refactored into attachCookiesToResponse
  // res.cookie('token', createdToken, {
  //     httpOnly:true,
  //     expiresIn: new Date(Date.now() + 1000*60*60*24),
  //     secure: process.env.NODE_ENV === 'production',
  //     signed: true,
  // })
  attachCookiesToResponse(createdToken, res)
  res
    .status(StatusCodes.CREATED)
    .json({
      name: user.name,
      email: user.email,
      userId: user._id,
      role: user.role,
      pass: user.password,
      createdToken,
    })
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  if (!email) {
    throw new CustomError.BadRequestError('Please input your email')
  }
  if (!password) {
    throw new CustomError.BadRequestError('Please input your password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.Unauthenticated(`Invalid credentials`)
  }

  const passwordCheck = await bcryptjs.compare(password, user.password)

  if (!passwordCheck) {
    throw new CustomError.Unauthenticated('Invalid credentials')
  }
  const createdToken = user.generateToken()
  attachCookiesToResponse(createdToken, res)
  res
    .status(StatusCodes.OK)
    .json({ email, password: user.password, role: user.role, createdToken })
}

const logoutUser = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).send('logged out')
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
}
