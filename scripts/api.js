const express = require('express');
const router = express.Router();


const MongoClient = require('mongodb').MongoClient;
//path database
const url = 'mongodb://localhost:27017'; 
// Database Name
const dbName = 'boonmeeweb';


const assert = require('assert');


module.exports = router;//exports router to app.js file


router.get('/menu',(req,res)=>{
    MongoClient.connect(url,function(err,client){
    assert.equal(null, err);
    const db = client.db(dbName);
    findDocument(db,result=>{  
        res.json(result);
        client.close();
    })   
   });
});


function findDocument(db,callback){
    db.collection('menu')
    .find()
    .toArray((err,result)=>{
        if(err) throw err;
        callback(result);
    })
}





