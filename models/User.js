const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    //match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please input a valid email"],
    required: [true, 'Please provide an email'],
    validate: {
      message: 'Please provide a valid email',
      validator: validator.isEmail,
    },
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
})

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
})

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { name: this.name, role: this.role, userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_TOKE_VALIDITY }
  )
}

userSchema.methods.checkToken = function (token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = mongoose.model('User', userSchema)
