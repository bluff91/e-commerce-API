const Review = require('../models/Review')
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const  CustomAPIError  = require('../errors')

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({})
    if (reviews.length < 1) {
        res.status(StatusCodes.OK).json("No reviews to show")
    }
    res.status(StatusCodes.OK).json({reviews, nrHits:reviews.length})
    // const review = await Review.deleteMany({})
    // res.send("done")
}

const createReview = async (req, res) => {
    if (!req.body.product) {
        throw new CustomAPIError.BadRequestError('Input product Id')
    }
    const product = await Product.findOne({_id:req.body.product})
    if (!product) {
        throw new CustomAPIError.NotFound(`No product with id ${req.body.product} found`)
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
