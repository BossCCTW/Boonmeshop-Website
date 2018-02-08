// var fs = require('fs');
// fs.watchFile('textTest.txt',function(curr,prev){
//     console.log(curr.atimeMs);
// });

// setTimeout(function(){
//     fs.unwatchFile('textTest.txt');
// },60000);
// console.log('User-code is running...');

// var fs = require('fs');
// function sync(func){
//     function callback(err,data){
//         func(data);
//     }
//     fs.readFile('textTest.txt',callback);
// }
// sync(function(data){
//     console.log(data.toString());
// });

// console.log('USERCODE');




// var fs = require('fs');
// var myPromise = new Promise(function(resolve,reject){
//     fs.readFile('firstname.txt',function(err,data){            
//         let result = data.toString();
//         console.log(result);
//         resolve(result);
//     });
// });
// myPromise.then(function(data){
//     fs.readFile('lastname.txt',function(err,data2){
//         var result = data+' '+data2.toString();
//         console.log(result);
//         return result;
//     });
           
// }).then(function(data){
//     fs.readFile('address.txt',function(err,data3){
//         let result = data+' '+data3.toString();
//         console.log(result);
//         return result;
//     });
// });
// console.log('usercode');

// var fs = require('fs');
// function setPromise(filename){
//     let myPromise = new Promise(function(resolve,reject){
//         fs.readFile(filename,function(err,data){
//             resolve(data.toString());
//         });
//     });
//     return myPromise;
// }
// let listPromise = [
//     setPromise('firstname.txt'),
//     setPromise('lastname.txt'),
//     setPromise('address.txt')
// ];
// Promise.all(listPromise).then(function(result){
//     let text ='';
//     for(let i = 0;i<result.length;i++){
//         text += '|'+result[i];
//     }
//     console.log(text);
// });

let m = Math.round(1.49);
console.log(m);


	

