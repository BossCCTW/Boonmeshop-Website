const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');


//import Model Menu Schema
const Menu = require('../models/menu');


//Create Multer Stotage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/menu/')
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


//Middleware get data from POST
router.use(bodyParser.json());




//@GET load all menu 
router.get('/', (req, res) => {
    Menu.find()
        .exec()
        .then(doc => {
            // console.log(doc);
            if (doc.length >= 0) {
                res.status(200).json(doc);
            } else {
                res.status(500).json({
                    message: 'No entries found'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//@GET by ID
router.get('/:menuId', (req, res) => {
    const menuId = req.params.menuId;
    Menu.findById(menuId)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
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


//@POST Upload namemenu and file image icon
router.post('/', upload.single('fileMenuIcon'), (req, res) => {
    if (req.file && req.body) {
        console.log(req.body);
        const menu = new Menu({
            _id: new mongoose.Types.ObjectId(),
            nameTh: req.body.nameMenuTh,
            nameEn: req.body.nameMenuEn,
            iconUri: req.file.path
        });
        menu.save()
            .then(result => {
                // res.status(201).json({
                //     message: 'Created Menu successfully',
                //     menuDetail: {
                //         _id: result._id,
                //         nameTh: result.nameTh,
                //         nameEn: result.nameEn,
                //         urifile: result.iconUri
                //     }
                // });
                res.redirect('/admin');
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    message: 'Cath in mongoose'
                });
            });
    } else {
        res.redirect(400, '/admin');
    }

});

// @PATCH EDIT MENU BY ID
router.patch('/:menuId', (req, res) => {
    const id = req.params.menuId;
    if (req.body.nameTh && req.body.nameEn) {
        // Menu.update({_id: id},{ $set: {nameTh:req.body.nameTh,nameEn:req.body.nameEn}})
        Menu.update({_id: id}, {$set: req.body})
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
                    error: err
                });
            });
    }else{
        res.status(500).json({
            error: 'Path data not found!'
        });
    }

});

//@DELETE delete menu by Id
router.delete('/:menuId', (req, res) => {
    const id = req.params.menuId;
    let imgUri = req.body.imgUri;
    
    console.log(imgUri);
    
    //check file image exist from path imgUri
    if (fs.existsSync(imgUri)) {
        fs.unlink(imgUri, (err) => {
            if (err) throw err;
            console.log(imgUri+' was deleted');        
         });
    }else{

    }
    
    Menu.remove({
            _id: id
        }).exec()
        .then(result => {
             if(result.ok == 1){
                res.status(200).json({
                    status: 200,
                    result:imgUri+' was deleted'
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