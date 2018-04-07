const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/menu/')
    },
    filename: function (req, file, cb) {
      cb(null,Date.now()+  file.originalname);
    }
  });

const fileFilter = (req,file,callback)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null,true);
    }else{
        callback(null,false);
    }
};


const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024 *5
    },
    fileFilter:fileFilter
});


//Middleware
router.use(bodyParser.json());
//import Model Menu Schema
const Menu = require('../models/menu');


//@GET load all menu 
router.get('/',(req,res)=>{
    res.json({ok:'200'});  
});


//@POST Upload namemenu and file image icon
router.post('/',upload.single('fileMenuIcon'),(req,res)=>{
    console.log(req.file.path);
    
    const menu = new Menu({
        _id: new mongoose.Types.ObjectId(),
        nameTh: req.body.nameMenuTh,
        nameEn: req.body.nameMenuEn,
        menuIcon: req.file.path
    });
    menu
    .save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'Created Menu successfully',
            menuDetail:{
                _id:result._id,
                nameTh: result.nameTh,
                nameEn: result.nameEn,
                urlfile: result.menuIcon
            }   
        });    
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err,
            position:'Post process'
        });
    });
});



module.exports = router;



// const fileUpload = require('express-fileupload');
// router.use(fileUpload());
//@POST USEING  'express-fileupload'
//@route POST  //api/menu/upload
//@desc upload file icon imag and name en,nama th
// router.post('/',(req,res)=>{
//     if(req.files.fileMenuIcon){
//         let fileImage = req.files.fileMenuIcon;
//         console.log(fileImage.name); //name image test.jpg 
//         console.log(fileImage.mimetype); // type  image/jpeg
//         console.log(fileImage.data); //buffer ff d81 00 01 00 00 ff fe

       
//         fileImage.mv('./upload/menu/'+fileImage.name,(err)=>{
//             if (err) return res.status(500).send('UploadERROR ::'+err);
//             res.send('File uploaded!'+ JSON.stringify(req.body));   
//         });

//     }else{
//         // return res.status('400').send('No files were uploaded.');
//         return res.redirect(400,'/admin');
//     }

// });
