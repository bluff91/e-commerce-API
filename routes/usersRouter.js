const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication')

const {
  getAllusers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController')

router.get(
  '/',
  authenticateUser,
  authorizePermission('admin', 'owner'),
  getAllusers
)
router.get('/showMe', authenticateUser, showCurrentUser)
router.patch('/updateUser', authenticateUser, updateUser)
router.patch('/updateUserPassword', authenticateUser, updateUserPassword)
router.get('/:id', authenticateUser, getSingleUser)

// router.route('/').get(getAllusers)
// router.route('/:id').get(getSingleUser).patch(updateUser)

module.exports = router
