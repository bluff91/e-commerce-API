require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

//middleware
const ErrorHandlerMiddleware = require('./middleware/error-handler')
const NotFoundMiddleware = require('./middleware/not-found')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')

//security
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

//routes
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/usersRouter')
const productRouter = require('./routes/productRouter')
const reviewRouter = require('./routes/reviewRouter')
const orderRouter = require('./routes/orderRouter')

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(
  fileupload({ useTempFiles: true, limits: { fileSize: 50 * 1024 * 1024 } })
)

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)
app.use(express.static('./public'))

app.use(NotFoundMiddleware)
app.use(ErrorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await mongoose.connect(process.env.MANGO_URI)
    app.listen(port, console.log(`Server started on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
