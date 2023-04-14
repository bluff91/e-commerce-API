const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')

const {
    getAllReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview,
    getProductReview
    } = require ('../controllers/reviewController')

router.route('/').get(getAllReviews).post(authenticateUser, createReview)
router.route('/:id').get(getReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview)
router.route('/:id/reviews').get(getProductReview)

module.exports = router

