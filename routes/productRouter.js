const express = require('express')
const router = express.Router()
const {authenticateUser, authorizePermission} = require('../middleware/authentication')

const {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    } = require('../controllers/productController')

router.route('/').get(getAllProducts).post(authenticateUser, authorizePermission('admin', 'owner') ,createProduct)

router.route('/uploadImage').post(authenticateUser, authorizePermission('admin', 'owner') ,uploadImage)

router.route('/:id').get(getSingleProduct)
                            .patch(authenticateUser, authorizePermission('admin', 'owner') ,updateProduct)
                            .delete(authenticateUser, authorizePermission('admin', 'owner') ,deleteProduct)


module.exports = router