require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

//middleware
const ErrorHandlerMiddleware = require('./middleware/error-handler')
const NotFoundMiddleware = require('./middleware/not-found')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')

//routes
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/usersRouter')
const productRouter = require('./routes/productRouter')
const reviewRouter = require('./routes/reviewRouter')

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileupload({useTempFiles:true, limits:{fileSize: 50*1024*1024}}))


app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies);
    res.status(200).json("testing route working")
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)

app.use(NotFoundMiddleware)
app.use(ErrorHandlerMiddleware)



const port = process.env.PORT || 5000

const start = async () => {
    try {
        await mongoose.connect(process.env.MANGO_URI)
        app.listen(port, console.log(`Server started on port ${port}`))
    } catch (error) {
        console.log(error);
    }
}

start()