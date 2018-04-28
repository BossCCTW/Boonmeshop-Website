const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name:{type:String,require:true},
    price:{type:Number,require:true},
    imageAvatar:{type:String,require:true},
    imageGallery:{type:[String],require:true},
    type:{type:mongoose.Schema.Types.Mixed,require:true},
    material:{type:[mongoose.Schema.Types.Mixed],require:true},
    payment:{
        payOnBefore :{type:Boolean,require:true},
        payOnDelivery:{type:Boolean,require:true}
    },
    delivery:{
        regular: {type:Boolean,require:true},
        register:{type:Boolean,require:true},
        ems:{type:Boolean,require:true}
    },
    status:{
        name:{type:[String],require:true},
        detail:{type:String,require:true}
    },
    amount:{type:Number,require:true},
    information:{type:String,require:true}
});

module.exports = mongoose.model('Product',productSchema);




