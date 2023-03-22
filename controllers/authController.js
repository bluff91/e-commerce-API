const User = require('../models/User')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const bcryptjs = require('bcryptjs')



const registerUser = async (req, res) => {
    const {name, email, password} = req.body
    const user = await User.create({name, email, password})
    const createdToken = user.generateToken()
    res.status(StatusCodes.CREATED).json({name:user.name, email:user.email, userId:user._id, role:user.role, pass:user.password, createdToken})
}

const loginUser = async (req, res) => {
    const {name, email, password} = req.body
    if (!name) {
        throw new CustomError.BadRequestError("Please provide a name")
    }
    if (!password) {
        throw new CustomError.BadRequestError("Please input your password")
    }
    const user = await User.findOne({email})
    if (!user) {
        throw new CustomError.NotFound(`User with email ${email} does not exist`)
    }
    if (name !== user.name) {
        throw new CustomError.Unauthenticated("Invalid credentials")
    }

    const passwordCheck = await bcryptjs.compare(password, user.password)
    
    if (!passwordCheck) {
        throw new CustomError.Unauthenticated("Invalid password")
    }
    const createdToken = user.generateToken()
    const isValid = user.checkToken(createdToken)
    //here is where you left off
    

    res.status(StatusCodes.OK).json({name,email,password:user.password, role:user.role,createdToken})
}

const logoutUser = async (req, res) => {
    res.send("???:(")
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
}