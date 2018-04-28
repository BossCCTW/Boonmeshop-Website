const mongoose = require('mongoose');
const promotionSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title: {type:String,required:true},
    queryCode:{type:String,required:true},
    imageUri:{type:String,required:true}
});
module.exports = mongoose.model('Promotion',promotionSchema);
