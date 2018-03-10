"use strict";
// var obj ={
//     name:'chanin',
//     jobs:'Programer',
//     age:'26'
// };
// //การกำหนด Attibute ให้กับ property มี 4 แบบ
// Object.defineProperty(obj,'_asset',
//     {value:'200M',
//     writable:true,
//     enumerable:false,
//     configurable:false}
//     );
// Object.defineProperty(obj,'asset',{
//     get:function(){
//         return this._asset;
//     },
//     set:function(value){
//         return this._asset = value;
//     },
//     enumerable:false,
//     configurable:true
// });
// //============================================


// function Animal(name){
//     this.name= name;
// }
// Animal.prototype.showName = function(){
//     return 'Animal :'+this.name;
// };

// function Dog(name){
//     Animal.call(this,name);
// }
// Dog.prototype.__proto__ = Animal.prototype;
// Dog.prototype.cry = function(){
//     console.log(this.name+' bok! bok!');
// };

// function Bangkaew(name){
//     Dog.call(this,name);
// }
// Bangkaew.prototype.__proto__ = Dog.prototype;
// Bangkaew.prototype.guard = function(){
//     console.log(this.name+"is Guarding..");
    
// };
// function Cat(name){
//     Animal.call(this,name);
// }
// Cat.prototype.__proto__ = Animal.prototype;
// Cat.prototype.cry = function(){
//     console.log(this.name+' Meaw! Meaw!');
// };

// var bobby = new Bangkaew('Bobby');



// Animal.prototype.run = function(){
//     return this.name+' is Running...';
// }
// Animal.prototype.walk = function(){
//     return this.name+' is Walking...';
// }
// var booboo = new Bangkaew('booboo');
// var blackky = new Cat('Blackky'); 
// //================================================
// // function Car(brand,type){
// //     this.brand = brand;
// //     this.type = type;
// // }
// // Car.prototype.drive = function(){
// //     console.log(this.brand+'are driving...')
// // }
// var Car ={
//     brand:'brand',
//     type:'type',
//     drive:
//         function(){
//             console.log('Driving...'); 
//         }
    
// };

// function extend(parent,child){
//     var i;
//     child = child || {};
//     for(index in parent){ // for in  ตรง index จะ return ชื่อ property หรือชื่อ key ของ Object มาทุกๆรอบ
//         /// hasOwnProperty คือ การตรวจว่า มี property นั้น ใน Object หรือไม่ (เฉพาะที่อยู่ใน Object) ไม่รวม Prototype
//         if(parent.hasOwnProperty(index)){
//             child[index]=parent[index];
//         }
//     }
//     return child;
// }

// var honda = extend(Car);

// console.log(Car);





