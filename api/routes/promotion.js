const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

//Import Model [Promotion]
const Promotion  = require('../models/promotion');
//Middleware [Get data from [POST] for => get parameter in req.body]
router.use(bodyParser());
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

//Create Multer Stotage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/promotion/')
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


//@GET ==> FOR ALL PROMOTION LIST DATA
router.get('/',(req,res)=>{
    Promotion.find()
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

//@GET BY ID ==> FOR GET ONE ITEM BY ID
router.get('/:idPromotion',(req,res)=>{
    const id = req.params.idPromotion;
    Promotion.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    status:200,
                    data:doc});
            } else {
                res.status(404).json({
                    status:404,
                    message: 'No valid entry found for provided ID'
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status:500,
                error: err
            });
        });

});

//@POST ==> FOR UPLOAD DATA AND IMAGE PROMOTION
router.post('/',upload.single('imagePromo'),(req,res)=>{
    //req.body.titlePromo
    //req.body.queryCodePromo
    //req.file.path
    const promotionPost = new Promotion({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.titlePromo,
        queryCode: req.body.queryCodePromo,
        imageUri:req.file.path  
    });
    promotionPost.save()
    .then(result =>{
        res.status(200).json({
            status:200,
            result:result
    }) })
    .catch(err=>{
        res.status(500).json({
            status:500,
            error:err
        });
    });
 
});

//@PATCH ==> FOR EDIT DATA BY ID 
router.patch('/:idPromotion',upload.single('imageUpdatePromo'),(req,res)=>{
    const id = req.params.idPromotion;
    let titleUpdate = req.body.titleUpdate;
    let queryCodeUpdate = req.body.queryCodeUpdate;

    let dataUpdate = {};
    if(req.file == undefined){
        dataUpdate = {
            title:titleUpdate,
            queryCode:queryCodeUpdate
        };
    }else{
        dataUpdate = {
            title:titleUpdate,
            queryCode:queryCodeUpdate,
            imageUri:req.file.path
        };

        //if user send Image Update Must Delete Image Old
        //searching by id and get path old image for delete
        Promotion.findById(id)
                .exec()
                .then(doc => {                  
                    if (doc) {
                       let imageUri = doc.imageUri;
                        //delete Old image
                        //check file image exist from path imgUri
                        if (fs.existsSync(imageUri)) {
                            fs.unlink(imageUri, (err) => {
                            if (err) throw err;
                                console.log(imageUri+' was deleted !');        
                            });
                        }else{
                            console.log('image is not exist');                
                        }
                            
                    } else {
                         console.log(JSON.stringify({message: 'No valid entry found for provided ID'}));   
                    }
                })
                .catch(err => {
                    console.log(err);
                });     
    }

    Promotion.update({_id: id}, {$set: dataUpdate})
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

//@DELETE ==> FOR DELETE DATA BY ID
router.delete('/:idPromotion',(req,res)=>{
    const id = req.params.idPromotion;

    //find by id for get path of image for delete
    Promotion.findById(id)
    .exec()
    .then(doc => {                  
        if (doc) {

             //Delete data in mongoDB by ID
            Promotion.remove({
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
            ///==============================

            //Get path of image in doc for delete
           let imageUri = doc.imageUri;
            //check file image exist from path imgUri
            if (fs.existsSync(imageUri)) {
                fs.unlink(imageUri, (err) => {
                if (err) throw err;
                    console.log(imageUri+' was deleted !!');        
                });
            }else{
                console.log('image is not exist');                
            }
                
        } else {
            //when findby id not found  becouse id is not exist in mongodb
            res.status(400).json({
                status:400,
                message:'No valid entry found for provided ID'
            });             
        }})
        .catch(err => {
            console.log(err);
        }); 

   
});

//get list of name image promotion index.html page
const pathFileImagePromotion ='./assets/imgs/promotion';
router.get('/list/image', (req, res) => {
    fs.readdir(pathFileImagePromotion, (err, files) => {
        if(err){
            res.status(404).json({
                status:404,
                data:err
            });
        }
        // res.setHeader('Content-Type', 'application/json');
        // res.send(JSON.stringify(files));

        res.status(200).json({
            status:200,
            data:files
        })
    });
});


module.exports = router;