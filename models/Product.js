const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name:{type:String, },
    category:{type:String, },
    price:{type:Number, },
    description:{type:String, },
    company:{type:String, },
    colors:{type:[], of:"String", },
    featured:{type: Boolean, },
    freeShipping:{type: Boolean, },
    inventory:{type:Number, },
    averageRating:{type:Number, },
    user:{type: mongoose.Types.ObjectId, ref:"User"}
}, {timestamps:true})

module.exports = mongoose.model('Product', ProductSchema)