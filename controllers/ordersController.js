const Order = require('../models/Order')
const { StatusCodes } = require('http-status-codes')

const getAllOrders = async (req, res) => {
  res.send('Get All Orders')
}

const getSingleOrder = async (req, res) => {
  res.send('Get Single Order')
}

const getCurrentUserOrder = async (req, res) => {
  res.send('Get Current User Order')
}

const createOrder = async (req, res) => {
  res.send('Create Order')
}

const updateOrder = async (req, res) => {
  res.send('Update Order')
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
}
