const mongoose = require('mongoose');
const materialSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nameTh:{type:String,require:true},
    nameEn:{type:String,require:true}
});
module.exports = mongoose.model('Material',materialSchema);