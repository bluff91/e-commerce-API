const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')

const {
    getAllReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview
    } = require ('../controllers/reviewController')

router.route('/').get(getAllReviews).post(authenticateUser, createReview)
router.route('/:id').get(getReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview)

module.exports = router

