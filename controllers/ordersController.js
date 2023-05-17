const Order = require('../models/Order')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { checkPermissions } = require('../utils/utilityFunctions')
const CustomError = require('../errors')

//fake stripe function
const fakeStripeAPI = async ({ amount, currency = 'eur' }) => {
  const clientSecret = Math.random() * 10
  return { clientSecret, amount }
}

const getAllOrders = async (req, res) => {
  const user = req.user
  console.log('this user is:', user)
  const orders = await Order.find({})
  if (orders.length < 1) {
    throw new CustomError.NotFound(`No orders to show`)
  }
  res.status(StatusCodes.OK).json({ orders, nrHits: orders.length })
}

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new CustomError.NotFound(`Order ${orderId} does not exist`)
  }
  checkPermissions(req.user, order.user)
  res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrder = async (req, res) => {
  const { userId } = req.user
  const orders = await Order.find({ user: userId })
  if (orders.length < 1) {
    throw new CustomError.NotFound(`User ${userId} has no orders`)
  }
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shipping_fee } = req.body
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided')
  }
  if (!tax || !shipping_fee) {
    throw new CustomError.BadRequestError('Please provide tax and shipping fee')
  }
  let orderItems = []
  let subtotal = 0
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new CustomError.NotFound(`No product with id ${item.product} found`)
    }
    const { name, image, price, _id } = dbProduct
    const SingleOrderItem = {
      amount: item.amount,
      name,
      image,
      product: _id,
      price,
    }
    // add item to order:
    orderItems = [...orderItems, SingleOrderItem]
    subtotal += item.amount * price
  }

  //calculate total;
  const total = subtotal + subtotal * tax + shipping_fee

  //simulate Stripe call
  //get client secret
  const paymentIntent = await fakeStripeAPI({ amount: total, currency: 'eur' })
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee: shipping_fee,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.userId,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const { userId } = req.user
  let { paymentIntentId } = req.body
  const order = await Order.findOneAndUpdate({ _id: orderId, user: userId })
  if (!order) {
    throw new CustomError.NotFound(`Order ${orderId} not found`)
  }
  checkPermissions(req.user, order.user)
  order.paymentIntentId = paymentIntentId
  order.status = 'paid'
  await order.save()
  res.status(StatusCodes.OK).json({ order })
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
}
