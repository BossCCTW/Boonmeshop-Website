const express = require('express');
const fs = require('fs');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');



//Import model
const Slideshow = require('../models/slideshow');

//Middleware [Get data from [POST] for => get parameter in req.body]
// router.use(bodyParser.urlencoded());
router.use(bodyParser.json());


//Create Multer Stotage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/slideshow/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

//Create Multer filefilter
const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

//SET storage and limit-file and file-filter in upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});



const pathSlideShow ='./assets/imgs/slideshow';
router.get('/', (req, res) => {
    fs.readdir(pathSlideShow, (err, files) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(files));
    });
});

//@POST IMAGE AND CODE SLIDESHOW
router.post('/',upload.single('fileImage'),(req,res)=>{
    // console.log(req.body.codeLink);
    // console.log(req.file.path);

       
    if(req.file && req.body){
        console.log(typeof req.body.codeLink);
        let arrCodeLink = req.body.codeLink.split(',');
        console.log(typeof arrCodeLink);

        const slideshow = new Slideshow({
            _id: new mongoose.Types.ObjectId(),
            codeLink: arrCodeLink,
            imgUri: req.file.path    
        });

        slideshow.save()
        .then(result =>{
            res.status(200).json({
                status: 200,
                message: result
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            });
        });
    }
    
    
});

module.exports = router;