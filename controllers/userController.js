const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const bcryptjs = require('bcryptjs')
const { attachCookiesToResponse, checkPermissions } = require('../utils/utilityFunctions')

const getAllusers = async (req, res) => {
    console.log(req.user);
    const users = await User.find({}).select('-__v -password')
    res.status(StatusCodes.OK).json({users, nrHits:users.length})
}

const getSingleUser = async (req, res) => {
    const params = req.params.id
    const user = await User.findOne({_id:params}).select('-__v -password')
    if (!user) {
        throw new CustomError.NotFound('User not found')
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json(user)
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user:req.user})
}

const updateUser = async (req, res) => {
    const {name, email} = req.body
    if (!name || !email) {
        throw new CustomError.BadRequestError("Please input both name and email")
    } 
    const user = await User.findOneAndUpdate({_id:req.user.userId}, {name:name, email:email}, {new:true, runValidators:true})
    const createdToken = user.generateToken()
    attachCookiesToResponse(createdToken, res)

    // bellow is an alternate way of updateing the user, using user.save()
    // const user = await User.findOne({_id:req.user.userId})
    // user.name = name;
    // user.email = email
    // user.save()
    // const createdToken = user.generateToken()
    // attachCookiesToResponse(createdToken, res)
    
    res.status(StatusCodes.OK).json(user)
}

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError("Please input correct data")
    }
    const user = await User.findOne({_id:req.user.userId})
    if (!user) {
        throw new CustomError.BadRequestError(`No user with ${req.user.userId}`)
    }
    const isPasswordCheck = await bcryptjs.compare(oldPassword, user.password)
    if (!isPasswordCheck) {
        throw new CustomError.Unauthenticated("Invalid credentials")
    }
    // const salt = await bcryptjs.genSalt(10)
    // const hashedNewPassword = await bcryptjs.hash(newPassword, salt)
    // await User.findOneAndUpdate({_id:req.user.userId}, {password:newPassword})

    //alternative to the code above
    user.password = newPassword
    await user.save()
    
    res.status(StatusCodes.OK).json({user:req.user})
}

module.exports = {
    getAllusers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}