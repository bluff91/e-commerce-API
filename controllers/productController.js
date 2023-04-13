const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const fs = require('fs')


const getAllProducts = async (req, res) => {
    const products = await Product.find({}).select('-__v -updatedAt').sort('-createdAt')
    if (!products) {
        res.status(StatusCodes.OK).send("There are no products to show")
    }
    res.status(StatusCodes.OK).json({products, nrHits:products.length})
}

const createProduct = async (req, res) => {
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json(product)
}

const getSingleProduct = async (req, res) => {
    const product = await Product.findOne({_id:req.params.id}).select('-__v -updatedAt').populate('reviews')
    if (!product) {
        throw new CustomError.NotFound(`item with id ${req.params.id} not found`)
    }
    res.status(StatusCodes.OK).json(product)
}

const updateProduct = async (req, res) => {
    const product = await Product.findOneAndUpdate({_id:req.params.id}, req.body, {new:true})
    if (!product) {
        throw new CustomError.NotFound(`item with id ${req.params.id} not found`)
    }
    res.status(StatusCodes.OK).json(product)
}

const deleteProduct = async (req, res) => {
    const product = await Product.findOneAndRemove({_id:req.params.id})
    if (!product) {
        throw new CustomError.NotFound(`item with id ${req.params.id} not found`)
    }
    res.status(StatusCodes.OK).json(product)
}

const uploadImage = async (req, res) => {
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename:true,
        folder:'test-files'
    })
    fs.unlinkSync(req.files.image.tempFilePath)
    res.status(StatusCodes.OK).json({src:result.secure_url})
}

module.exports = {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
}