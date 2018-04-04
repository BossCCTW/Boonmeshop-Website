const express = require('express');
const router = express.Router();


const MongoClient = require('mongodb').MongoClient;
//path database
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'boonmeeweb';


module.exports = router; //exports router to app.js file


router.get('/menu', (req, res) => {

    MongoClient.connect(url, function (err, client) {
        if (err) throw err;
        const db = client.db(dbName);
        findMenu(db, result => {
            res.json(result);
            client.close();
        });
    });
});


function findMenu(db, callback) {
    db.collection('menu')
        .find()
        .toArray((err, result) => {
            if (err) throw err;
            callback(result);
        });
}