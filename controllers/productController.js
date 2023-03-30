const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')


const getAllProducts = async (req, res) => {
    res.send('get all products')
}

const createProduct = async (req, res) => {
    res.send('createProduct')
}

const getSingleProduct = async (req, res) => {
    res.send('getSingleProduct')
}

const updateProduct = async (req, res) => {
    res.send('updateProduct')
}

const deleteProduct = async (req, res) => {
    res.send('deleteProduct')
}

const uploadImage = async (req, res) => {
    res.send('addImage')
}

module.exports = {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
}