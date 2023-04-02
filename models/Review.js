const mongoose = require('mongoose')


const ReviewSchema = new mongoose.Schema({
    rating:{
        type: Number,
        required:[true, "Please provide a rating"],
        min:1.0,
    },
    title:{
        type:String,
        required:[true, "Please provide a title"],
        minlength:3,
        maxlength: 50,
    },
    comment:{
        type:String,
        required:[true, "Please add a comment"],
        minlength:3,
        maxlength:120,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:"Product",
        required:true,
    },
}, {timestamps:true})

module.exports = mongoose.model('Review',ReviewSchema)