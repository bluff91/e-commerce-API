const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const getAllusers = async (req, res) => {
    console.log(req.user);
    const users = await User.find({role:'user'}).select('-__v -password')
    res.status(StatusCodes.OK).json({users, nrHits:users.length})
}

const getSingleUser = async (req, res) => {
    const params = req.params.id
    const user = await User.findOne({_id:params}).select('-__v -password')
    if (!user) {
        throw new CustomError.NotFound('User not found')
    }
    res.status(StatusCodes.OK).json(user)
}

const showCurrentUser = async (req, res) => {
    res.send("show current user")
}

const updateUser = async (req, res) => {
    res.send("update user")
}

const updateUserPassword = async (req, res) => {
    res.send("update user password")
}

module.exports = {
    getAllusers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}