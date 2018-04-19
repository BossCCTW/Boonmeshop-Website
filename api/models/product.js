const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    productCode:String,
    name:String,
    price:Number,
    status:{type:String,detail:Number},
    imagePrimary:String,
    imageSecondary:[String],
    detail:{recommend:String,size:String,color:String},
    unit:Number,
    material:[String],
    payment:{first:Boolean,later:Boolean},
    transport:Boolean
});

module.exports = mongoose.model('Product',productSchema);