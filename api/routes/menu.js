const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');


//Create Multer Stotage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/menu/')
    },
    filename: function (req, file, cb) {
      cb(null,Date.now()+  file.originalname);
    }
  });

//Create Multer filefilter
const fileFilter = (req,file,callback)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null,true);
    }else{
        callback(null,false);
    }
};

//SET storage and limit-file and file-filter in upload
const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024 *5
    },
    fileFilter:fileFilter
});


// //Middleware get data from POST
router.use(bodyParser.json());

//import Model Menu Schema
const Menu = require('../models/menu');


//@GET load all menu 
router.get('/',(req,res)=>{
    res.json({state:'Ok'});  
});


//@POST Upload namemenu and file image icon
router.post('/',upload.single('fileMenuIcon'),(req,res)=>{
    if(req.file){
        console.log(req.file.path);
        const menu = new Menu({
            _id: new mongoose.Types.ObjectId(),
            nameTh: req.body.nameMenuTh,
            nameEn: req.body.nameMenuEn,
            iconUri: req.file.path
        });
        menu.save()
        .then(result =>{
            res.status(201).json({
                message: 'Created Menu successfully',
                menuDetail:{
                    _id:result._id,
                    nameTh: result.nameTh,
                    nameEn: result.nameEn,
                    urifile: result.iconUri
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
    }else{
        res.redirect(400,'/admin');
    }
    
});

router.patch('/',(req,res)=>{
    res.status(200).json({
        message: 'Edit Menu!'
    });
});

//@DELETE delete menu by Id
router.delete('/:menuId',(req,res)=>{
    res.status(200).json({
        message: 'Delete Menu!'
    });
});

router.post('/newmenu',(req,res)=>{
    console.log(req.body.nameEn);
    
    const newMenu = {
        nameEn: req.body.nameEn,
        nameTh: req.body.nameTh
    };
    res.status(200).json({
        message : 'Create New Menu',
        newMenu: newMenu
    });
});


module.exports = router;


