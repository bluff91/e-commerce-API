const Review = require('../models/Review')
const Product = require('../models/Product')

const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('../errors')
const { checkPermissions } = require('../utils/utilityFunctions')

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: 'product',
      select: 'name price',
    })
    .populate({
      path: 'user',
      select: 'name',
    })
  if (reviews.length < 1) {
    return res.status(StatusCodes.OK).json('No reviews to show')
  }
  res.status(StatusCodes.OK).json({ reviews, nrHits: reviews.length })
  // const review = await Review.deleteMany({})
  // res.send("done")
}

const createReview = async (req, res) => {
  if (!req.body.product) {
    throw new CustomAPIError.BadRequestError('Input product Id')
  }
  const product = await Product.findOne({ _id: req.body.product })
  if (!product) {
    throw new CustomAPIError.NotFound(
      `No product with id ${req.body.product} found`
    )
  }

  const alreadySubmited = await Review.findOne({
    user: req.user.userId,
    product: req.body.product,
  })
  if (alreadySubmited) {
    throw new CustomAPIError.BadRequestError(
      'Already submited a review for this product'
    )
  }
  req.body.user = req.user.userId
  const review = await Review.create(req.body)
  res.status(StatusCodes.CREATED).json(review)
}

const getReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id })
  if (!review) {
    throw new CustomAPIError.NotFound(
      `Review with Id ${req.params.id} does not exist`
    )
  }
  res.status(StatusCodes.OK).json(review)
}

const updateReview = async (req, res) => {
  const id = req.params.id
  let { comment, title, rating } = req.body
  if (Object.keys(req.body).length === 0) {
    throw new CustomAPIError.BadRequestError('Please provide values to update')
  }
  let review = await Review.findOne({ _id: id })
  if (!review) {
    throw new CustomAPIError.NotFound(`Review with id ${id} not found`)
  }
  checkPermissions(req.user, review.user)

  if (title) {
    review.title = title
  }

  if (comment) {
    review.comment = comment
  }

  if (rating) {
    review.rating = rating
  }
  await review.save()
  res.status(StatusCodes.OK).json(review)
}

const deleteReview = async (req, res) => {
  const id = req.params.id
  const review = await Review.findOne({ _id: id })
  if (!review) {
    throw new CustomAPIError.BadRequestError(`Review with Id ${id} not found`)
  }
  checkPermissions(req.user, review.user)
  await review.remove()
  res.status(StatusCodes.OK).json({ msg: 'Review successfully deleted' })
}

const getProductReview = async (req, res) => {
  const { id: productId } = req.params
  const review = await Review.find({ product: productId }).select(
    '-updatedAt -__v'
  )
  res.status(StatusCodes.OK).json(review)
}

module.exports = {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getProductReview,
}
