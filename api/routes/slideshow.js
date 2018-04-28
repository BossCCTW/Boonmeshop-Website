const express = require('express');
const fs = require('fs');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');



//Import model
const Slideshow = require('../models/slideshow');

//Middleware [Get data from [POST] for => get parameter in req.body]
router.use(bodyParser());
router.use(bodyParser.urlencoded({extended:false}));
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
router.get('/all', (req, res) => {
    fs.readdir(pathSlideShow, (err, files) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(files));
    });
});

//@GET ALL the Slideshow 
router.get('/',(req,res)=>{
    Slideshow.find()
    .exec()
    .then(doc=>{
        if(doc.length > 0){
            res.status(200).json({
                status:200,
                data:doc
            });
        }else{
            res.status(500).json({
                status: 500,
                data: 'No Item Slideshow'
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
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

//@PATCH FOR EDIT CODE LINK AND IMAGE SLIDESHOW
router.patch('/:slideId',upload.single('imageUpdateSlide'),(req,res)=>{
   
    let id = req.params.slideId;
    let codeLink = req.body.codeLinkUpdate.split(',');
    
    // console.log(req.file);
    
    let dataUpdate = {};
    if(req.file == undefined){
        dataUpdate ={codeLink:codeLink};

    }else{
        dataUpdate = {codeLink:codeLink
                    ,imgUri:req.file.path};

                Slideshow.findById(id)
                .exec()
                .then(doc => {                  
                    if (doc) {
                       let imageUri = doc.imgUri;

                        //delete Old image
                        //check file image exist from path imgUri
                        if (fs.existsSync(imageUri)) {
                            fs.unlink(imageUri, (err) => {
                            if (err) throw err;
                                console.log(imageUri+' was deleted !!!!!');        
                            });
                        }else{
                            console.log('image is not exist');                
                        }
                            
                    } else {
                           console.log(JSON.stringify({message: 'No valid entry found for provided ID'}));   
                    }})
                    .catch(err => {
                        console.log(err);
                    });     
    }

    Slideshow.update({_id: id}, {$set: dataUpdate})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            status: 200,
            result: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status:500,
            error: err
        });
    });
    
     
});

//@DELETE SLIDE BY ID AND DELETE FILE IMAGE IN SERVER
router.delete('/:slideId',(req,res)=>{
    const id = req.params.slideId;
    let imageUri = req.body.imgDelete;

    //findById for delete image file
    Slideshow.findById(id)
    .exec()
    .then(doc => {                  
        if (doc) {
           let imageUri = doc.imgUri;

            //delete Old image
            //check file image exist from path imgUri
            if (fs.existsSync(imageUri)) {
                fs.unlink(imageUri, (err) => {
                if (err) throw err;
                    console.log(imageUri+' was deleted !!!!!');        
                });
            }else{
                console.log('image is not exist');                
            }
                
        } else {
               console.log(JSON.stringify({message: 'No valid entry found for provided ID'}));   
        }})
        .catch(err => {
            console.log(err);
        });     

    //delete data by id in mongoDB
    Slideshow.remove({
        _id: id
    }).exec()
    .then(result => {
         if(result.ok == 1){
            res.status(200).json({
                status: 200,
                result:result
            });
         }                 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});


module.exports = router;