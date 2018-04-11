const mongoose = require('mongoose');
const menuSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    nameTh : {type:String,required: true},
    nameEn : {type:String,required: true},
    iconUri:{type:String,required:true}
});

module.exports = mongoose.model('Menu',menuSchema);