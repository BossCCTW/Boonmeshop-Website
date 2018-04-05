const express = require('express');//
const bodyParser = require('body-parser');//
const path = require('path');//
const crypto = require('crypto');//
const mongoose = require('mongoose');//
const multer = require('multer');//
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


const router = express.Router();

 
//Middleware
router.use(bodyParser.json());
router.use(methodOverride('_method'));

//Mongo Uri
const MongoUri = 'mongodb://localhost:27017/boonmeeweb';
//Create mongo connection
const conn = mongoose.createConnection(MongoUri);
//Init gfs
let gfs;
conn.once('open',()=>{
    //Init Stream
    gfs = Grid(conn.db,mongoose.mongo);
    gfs.collection('menu');
});
//นาทีที่ 24
//Create storage engine







const fileSystem = require('fs');
const pathSlideShow = __dirname + '/assets/imgs/slideshow';
module.exports = router;//exports router to app.js file


router.get('/menu',(req,res)=>{
        res.json({ok:'1',connect : 'Connected successfully to server'});  
});
















router.get('/slideShow', (req, res) => {
    fileSystem.readdir(pathSlideShow, (err, files) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(files));
    });
});






