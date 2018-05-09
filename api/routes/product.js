const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');

//Import Model
const Product_Model = require('../models/product');

//set Bodyparser
router.use(bodyParser.urlencoded({ extended: true}));
router.use(bodyParser.json());

//Create Multer Stotage
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/product/')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
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



const multiUpload = upload.fields([{name:'imageAvatar',maxCount:1},{name:'imageGallery',maxCount:8}]);

//@GET BY FILTER
router.get('/filter',(req,res)=>{

    let filterRequest = JSON.parse(req.query.filter);
    let modified = filterRequest.modified;
    let limits = 0;
    let skip = 0;
    if(modified){
        limits = modified.limits;
        skip = modified.skip;
    }

    let filter = new Object();

    console.log(filterRequest);
    
    if(filterRequest.searchName){
        filter.name = new RegExp(filterRequest.searchName,'i');
    }
    if(filterRequest.priceMin || filterRequest.priceMax){
        if(filterRequest.priceMax < filterRequest.priceMin){
            filter.price = {$gt:filterRequest.priceMin-1};
        }else{
            if(filterRequest.priceMin == 0){
                filterRequest.priceMin = 1;
            }
            filter.price ={$gt:filterRequest.priceMin-1,$lt:filterRequest.priceMax+1};
        }
    }
    if(filterRequest.type){
        filter['type.idType'] = filterRequest.type;
    }

    if(filterRequest.payment){
        let payment  = filterRequest.payment;
        if(payment.before){
            filter['payment.payOnBefore'] = true;
        }
        if(payment.after){
            filter['payment.payOnDelivery'] = true;
        }
    }
    if(filterRequest.delivery){
        let delivery = filterRequest.delivery;
        if(delivery.regular){
            filter['delivery.regular'] = true;
        }else if(delivery.register){
            filter['delivery.register'] = true;
        }else if(delivery.ems){
            filter['delivery.ems'] = true;
        }
    }

    if(filterRequest.status){
        // 'status.name':{$in:['Normal']}
        let statusName = filterRequest.status
        filter['status.name']=statusName;
    }

    if(filterRequest.material){
        // material:{$elemMatch:{nameEn:{$in:['Plastic','Carbon']}}} 
        let arrMaterial = [];
        filterRequest.material.forEach(value=>{
            console.log(value.nameTh);
            arrMaterial.push(value.nameTh);
        });
        filter.material = {$elemMatch:{nameTh:{$in:arrMaterial}}};
    }
   
    Product_Model.find(filter)
    .skip(skip)
    .limit(limits)
    .select({
        _id:1,
        name:1,
        price:1,
        type:1,
        imageAvatar:1
    })
    .exec()
    .then(doc=>{
        if(doc.length > 0){
            Product_Model.count(filter,(err,count)=>{
                console.log('count in filter : '+ count );
                
                if(err){
                    res.status(500).json({
                        Error:err
                    });
                }

                res.status(200).json({
                    status:200,
                        data:doc,
                        count:count
                });
            });
           
        }else{
            res.status(400).json({
                status:400,
                data:'No Product item on filter.',
                count:doc.length
            });
        }
        
       
    });


    // {

    //     // name: new RegExp(name, 'i'), // ค้นหาจากชื่อที่มีคำ นั้นอยู่
    //     //  price:{$gt:190 ,$lt:1000} //$gt มากกว่า และ $lt น้อยกว่า
    //     // 'payment.payOnBefore': false
    //     // 'delivery.regular':false     ค้นหา delivery ที่ค่า regular = false
    //     // material:{nameTh:'ไม้',nameEn:'Wood'} ค้นหาแบบ เปะๆ nameTh และ nameEn ต้องตรงตามนี้
    //     // material:{$elemMatch:{nameEn:'Wood'}} ค้นหา วัสดุที่ มีชื่อ En ตรงกับ Wood ทั้งหมด
    //     // material:{$elemMatch:{nameEn:{$in:['Plastic','Carbon']}}} ค้นหา วัสดุที่มี nameEn = Plastic หรือ Carbon ก็ได้
    //     // 'status.name':{$in:['Normal']}
    //     // 'type.nameEn': 'Lamp'
        
    // }

});

//@GET FOR LIST
router.get('/list',(req,res)=>{
    
    let modified = JSON.parse(req.query.modified);
    let limit = modified.limits;
    let skip = modified.skip;
    if(!skip){
        skip = 0;
    }
    console.log(skip);
    
    
    let countOfCollection = 0;
    
   
    Product_Model.find()
    .skip(skip)
    .limit(limit)
    .select({
        _id:1,
        name:1,
        price:1,
        type:1,
        imageAvatar:1
    })
    .exec()
    .then(doc =>{
        if(doc.length > 0){

            Product_Model.count({},(err,count)=>{
                if(err) return;
                
                countOfCollection = count;

                res.status(200).json({
                    status:200,
                    data:doc,
                    count:countOfCollection
                });
            });

           
        }else{
            res.status(500).json({
                status: 500,
                data: 'No Item in database'
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
    
});

//@GET ALL 
router.get('/',(req,res)=>{
    Product_Model.find()
    .exec()
    .then(doc =>{
        if(doc.length > 0){
            res.status(200).json({
                status:200,
                data:doc
            });
        }else{
            res.status(500).json({
                status: 500,
                data: 'No Item'
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
        
});


//@GET By Id
router.get('/:idProduct',(req,res)=>{
    const id = req.params.idProduct;
    Product_Model.findById(id)
    .exec()
    .then(doc =>{
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


//@POST FOR UPLOAD
router.post('/',multiUpload,(req,res)=>{
         
    if(req.files['imageAvatar'][0] && req.files['imageGallery']){
        
        let name = req.body.nameProduct; //String
       
        let price = req.body.priceProduct; //Number
    
        let imageAvatar = req.files['imageAvatar'][0].path; //String
           
        let pathGallery = [];
        req.files['imageGallery'].forEach((value)=>{
            pathGallery.push(value.path)
        });
        let imageGallery = pathGallery; // String Array
        
        let type = JSON.parse(req.body.typeProduct); //Json arrray
        // type.idType
        // type.nameTh
        // type.nameEn     
        
        let material = JSON.parse(req.body.materialProduct);
   
        // material.forEach((value,index)=>{
        //     // value.nameTh
        //     // value.nameEn          
        // });
        
        let payment = JSON.parse(req.body.paymentProduct);  
        // payment.payOnBefore
        // payment.payOnDelivery
        let delivery = JSON.parse(req.body.deliveryProduct);
        // delivery.regular
        // delivery.register
        // delivery.ems
        let status = JSON.parse(req.body.statusProduct);
        // status.name
        // status.detail
        let amount = req.body.amountProduct;
        // let n = Number(amount);
        let information = req.body.informationProduct;
        // console.log(information);

      
        
        
        const productUpload = new Product_Model({
            _id: new mongoose.Types.ObjectId(),
            name:name,
            price:Number(price),
            imageAvatar:imageAvatar,
            imageGallery:imageGallery,
            type:type,
            material:material,
            payment:payment,
            delivery:delivery,
            status:status,
            amount:Number(amount),
            information:information
        });

        productUpload.save()
        .then(result =>{
            
            if(result._id){
                res.status(200).json({
                    status:200,
                    result:result
                });
            }else{
                res.status(400).json({
                    status:400,
                    message:'Bad Request!'
                })
            }
           
        })
        .catch(err =>{
            res.status(500).json(err);
        })
     
    }else{
        res.status(400).json({
            status:400,
            message:'Bad Request!'
        })
    }

});

// @PATCH FOR Update
router.patch('/:idProduct',multiUpload,(req,res)=>{
        const id = req.params.idProduct;

        let name = req.body.nameProductUpdate;
        let price = req.body.priceProductUpdate; 
        let type = JSON.parse(req.body.typeProductUpdate);
        let material = JSON.parse(req.body.materialProductUpdate);
        let payment = JSON.parse(req.body.paymentProductUpdate);  
        let delivery = JSON.parse(req.body.deliveryProductUpdate);
        let status = JSON.parse(req.body.statusProductUpdate);
        let amount = req.body.amountProductUpdate;
        let information = req.body.informationProductUpdate;
      
        let dataUpdate = {};

        dataUpdate.name = name;
        dataUpdate.price = price;
        dataUpdate.type = type;
        dataUpdate.material = material;
        dataUpdate.payment = payment;
        dataUpdate.delivery = delivery;
        dataUpdate.status = status;
        dataUpdate.amount = amount;
        dataUpdate.information = information;



    if(req.files['imageAvatar'] || req.files['imageGallery']){
        let avatar = false;
        let gallery = false;
        if(req.files['imageAvatar'] && req.files['imageGallery']){ 
           
            // message: 'imageAvatar : true, imageGallery : true'

            let imageAvatar = req.files['imageAvatar'][0].path; 
            let pathGallery = [];
            req.files['imageGallery'].forEach((value)=>{
                pathGallery.push(value.path)
            });
            let imageGallery = pathGallery; 

            dataUpdate.imageAvatar = imageAvatar;
            dataUpdate.imageGallery = imageGallery;

            avatar = true;
            gallery = true;

        }else if(req.files['imageAvatar'] && !req.files['imageGallery']){
            
                // message: 'imageAvatar : true, imageGallery : false'
            let imageAvatar = req.files['imageAvatar'][0].path; 

            dataUpdate.imageAvatar = imageAvatar;

            avatar = true;
            gallery = false;

        }else if(!req.files['imageAvatar'] && req.files['imageGallery']){
           
                // message: 'imageAvatar : false, imageGallery : true'
            let pathGallery = [];
             req.files['imageGallery'].forEach((value)=>{
                pathGallery.push(value.path)
            });
            let imageGallery = pathGallery; 

            dataUpdate.imageGallery = imageGallery;

            avatar = false;
            gallery = true;
        }

        //find product by id and get uri image for delet when use add new image
        Product_Model.findById(id)
        .exec()
        .then(doc=>{
            if(doc){
                console.log(doc);
                
                if(avatar && gallery){
                    let avataUri = doc.imageAvatar  //string
                    let galleryUri = doc.imageGallery // array

                    if (fs.existsSync(avataUri)) {
                        fs.unlink(avataUri, (err) => {
                        if (err) throw err;
                            console.log(avataUri+' was deleted !');        
                        });
                    }else{
                        console.log('image is not exist');                
                    }

                    galleryUri.forEach((value)=>{
                        if (fs.existsSync(value)) {
                            fs.unlink(value, (err) => {
                            if (err) throw err;
                                console.log(value+' was deleted !');        
                            });
                        }else{
                            console.log('image is not exist');                
                        }
                    });

                }else if(avatar && !gallery){
                    let avataUri = doc.imageAvatar 
                    if (fs.existsSync(avataUri)) {
                        fs.unlink(avataUri, (err) => {
                        if (err) throw err;
                            console.log(avataUri+' was deleted !');        
                        });
                    }else{
                        console.log('image is not exist');                
                    }

                }else if(!avatar && gallery){
                    let galleryUri = doc.imageGallery // array
                    galleryUri.forEach((value)=>{
                        if (fs.existsSync(value)) {
                            fs.unlink(value, (err) => {
                            if (err) throw err;
                                console.log(value+' was deleted !');        
                            });
                        }else{
                            console.log('image is not exist');                
                        }
                    });
                }            
            }
        })
        .catch(err => {
            console.log(err);
        });   

    }else if(!req.files['imageAvatar'] && !req.files['imageGallery']){
            // message: 'imageAvatar : false, imageGallery : false'
    }

    Product_Model.update({_id: id}, {$set: dataUpdate})
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

router.delete('/:idProduct',(req,res)=>{
    const id = req.params.idProduct;
    Product_Model.findById(id)
    .exec()
    .then(doc =>{
        if(doc){
            //delete image avatar and gallery
            let avataUri = doc.imageAvatar  //string
            let galleryUri = doc.imageGallery // array

            if (fs.existsSync(avataUri)) {
                fs.unlink(avataUri, (err) => {
                if (err) throw err;
                    console.log(avataUri+' was deleted !');        
                });
            }else{
                console.log('image is not exist');                
            }

            galleryUri.forEach((value)=>{
                if (fs.existsSync(value)) {
                    fs.unlink(value, (err) => {
                    if (err) throw err;
                        console.log(value+' was deleted !');        
                    });
                }else{
                    console.log('image is not exist');                
                }
            });

            Product_Model.remove({_id:id})
            .exec()
            .then(result =>{
                if(result.ok == 1){
                    res.status(200).json({
                        status:200,
                        message:result
                    })
                }else{
                    res.status(400).json({
                        status:400,
                        message:result
                    })
                }
            })
            .catch(err =>{
                res.status(500).json(err);
            })


        }
    })
});

module.exports = router;