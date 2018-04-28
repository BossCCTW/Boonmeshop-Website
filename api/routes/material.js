const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Import model
const Material = require('../models/material');
// router.use(bodyParser());
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());



//@GET ALL
router.get('/',(req,res)=>{
   Material.find()
   .exec()
   .then(doc =>{
       if(doc.length >0){
            res.status(200).json({
                status:200,
                data:doc
            });
       }else{
            res.status(500).json({
                status:500,
                data:'No item in Material'
            });
       }
       
   })
   .catch(err=>{
    res.status(500).json({
        error:err
    });
   });
});

//@GET BY ID
router.get('/:idMaterial',(req,res)=>{
    let id = req.params.idMaterial;
    Material.findById(id)
    .exec()
    .then(doc=>{
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
    .catch(err=>{
        res.status(500).json({
            status:500,
            error: err
        });
    });
});

//@POST FOR UPLOAD
router.post('/',(req,res)=>{  
    
    let nameTh = req.body.nameTh;
    let nameEn = req.body.nameEn;
    if(nameTh && nameEn){
        const materialUpload = new Material({
            _id: new mongoose.Types.ObjectId(),
            nameTh:nameTh,
            nameEn:nameEn
        });

        materialUpload.save()
        .then(result =>{
            res.status(200).json({
                status:200,
                result:result
            })
        })
        .catch(err =>{
            res.status(500).json(err);
        })

    }else{
        res.status(400).json({
            status:400,
            message: 'request not found!'
        });
    }
     
});

//@PATCH
router.patch('/:idMaterial',(req,res)=>{
        let id = req.params.idMaterial;
        let nameThUpdate  = req.body.nameThUpdate;
        let nameEnUpdate = req.body.nameEnUpdate;
        if(nameThUpdate && nameEnUpdate){
            let dataUpdate = {
                nameTh : nameThUpdate,
                nameEn : nameEnUpdate
            }
            Material.update({_id:id},{$set:dataUpdate})
            .exec()
            .then(result =>{
                res.status(200).json({
                    status:200,
                    result:result
                });
            })
            .catch(err =>{
                res.status(500).json({
                    status:500,
                    error:err
                })
            });
        }else{
            res.status(400).json({
                status:400,
                message:'Null data request'
            });
        }
     
});

//@DELETE
router.delete('/:idMaterial',(req,res)=>{
    let id = req.params.idMaterial;
    Material.remove({_id:id})
    .exec()
    .then(result =>{
        res.status(200).json({
            status:200,
            result:result
        })
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    })
});

module.exports = router;