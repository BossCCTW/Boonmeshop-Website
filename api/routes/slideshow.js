const express = require('express');
const fs = require('fs');
const router = express.Router();


const pathSlideShow ='./assets/imgs/slideshow';
router.get('/', (req, res) => {
    fs.readdir(pathSlideShow, (err, files) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(files));
    });
});

module.exports = router;