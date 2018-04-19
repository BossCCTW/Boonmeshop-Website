const mongoose = require('mongoose');
const slideshowSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    codeLink:{type:[String],required:true},
    imgUri:{type:String,required:true}
});

module.exports = mongoose.model('Slideshow',slideshowSchema);