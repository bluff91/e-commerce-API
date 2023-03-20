require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ErrorHandlerMiddleware = require('./middleware/error-handler')
const NotFoundMiddleware = require('./middleware/not-found')
const morgan = require('morgan')
const router = require('./routes/router')

app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({msg:'home route working'})
})
app.use('/api/v1/auth', router)

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