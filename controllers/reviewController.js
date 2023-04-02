const Review = require('../models/Review')
const {StatusCodes} = require('http-status-codes')
const  CustomAPIError  = require('../errors')

const getAllReviews = async (req, res) => {
    res.send('All Reviews')
}

const createReview = async (req, res) => {
    if (!req.body.product) {
        throw new CustomAPIError.BadRequestError('Input product Id')
    }
    req.body.user = req.user.userId
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json(review)
}

const getReview = async (req, res) => {
    res.send('getReview')
}

const updateReview = async (req, res) => {
    res.send('updateReview')
}

const deleteReview = async (req, res) => {
    res.send('deleteReview')
}

module.exports = {
    getAllReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview,
}
