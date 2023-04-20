const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1.0,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      minlength: 3,
      maxlength: 50,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      minlength: 3,
      maxlength: 120,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
)

ReviewSchema.index({ user: 1, product: 1 }, { unique: true })

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 },
      },
    },
  ])
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating) || 0,
        numberOfReviews: result[0]?.numberOfReviews || 0,
      },
      { new: true }
    )
  } catch (error) {
    console.log(error)
  }
  console.log(result)
}

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)
