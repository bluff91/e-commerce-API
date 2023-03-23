const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')

const {
    getAllusers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require ('../controllers/userController')

router.get('/', authenticateUser, getAllusers)
router.get('/showMe', showCurrentUser)
router.patch('/updateUser', updateUser)
router.patch('/updateUserPassword', updateUserPassword)
router.get('/:id', authenticateUser, getSingleUser)

// router.route('/').get(getAllusers)
// router.route('/:id').get(getSingleUser).patch(updateUser)

module.exports = router