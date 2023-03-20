const User = require('../models/User')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const bcryptjs = require('bcryptjs')


const registerUser = async (req, res) => {
    const user = await User.create(req.body)
    res.status(StatusCodes.CREATED).json({name:user.name, email:user.email, userId:user._id, role:user.role, pass:user.password})
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

    res.json("good job bud")
}

const logoutUser = async (req, res) => {
    res.send("???:(")
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
}