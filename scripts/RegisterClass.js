"use strict";

function Register(url,method){
    this.inputCheckboxAccept = document.getElementById('ipCheckboxAccept');
    this.inputUsername = document.getElementById('ipId');
    this.inputPassword = document.getElementById('ipPwd');
    this.inputFristName = document.getElementById('ipFristName');
    this.inputLastName = document.getElementById('ipLastName');
    this.inputTel = document.getElementById('ipTel');
    this.inputEmail = document.getElementById('ipEmail');
    this.inputSelectCareer = document.getElementById('ipSelectCareer');
    this.inputRadioMale = document.getElementById('ipGenderMale');   
    this.inputRadioFemale = document.getElementById('ipGenderFemale');
    this.inputFilePic = document.getElementById('ipFilePic');
    this.dataInput = {
        accept: this.inputCheckboxAccept,
        id:this.inputUsername,
        pwd:this.inputPassword,
        fname:this.inputFristName,
        lname:this.inputLastName,
        tel:this.inputTel,
        email:this.inputEmail,
        career:this.inputSelectCareer,
        gender:[this.inputRadioMale,this.inputRadioFemale],
        pic:this.inputFilePic
    };
    this._url = url;
    this._method = method;  
};

Register.prototype = function(){
  
    function sendData(){    
        if(checkInput(this.dataInput)){
         sendAjax(this._url,this._method,);
        }     
    }

    function checkInput(dataInput){   
        let checkCount = [8];
        checkCount[0] = trueAccept(dataInput.accept.checked); 
        checkCount[1] = trueIdPwd(dataInput.id.value,dataInput.pwd.value);     
        checkCount[2] = trueFLName();
        checkCount[3] = trueTal();
        checkCount[4] = trueEmail();
        checkCount[5] = trueCareer();
        checkCount[6] = trueGender();
        checkCount[7] = trueFilePic();
        
        //เช็คว่าทุกๆตัวใน array มีค่าเป็น true ทุกตัวหรือไม่โดยใช้ array.every(callback)
        //.every จะวนไปหาสมาชิกทุกตัวใน array
        if(checkCount.every(resultTotal)){
            console.log(checkCount);      
            return true;
        }else{
            console.log(checkCount); 
            return false;
        }
        
        //return boolean แต่ละช่องออกไป
        function resultTotal(result){
            return result;
        }
    }


    
    function trueAccept(check){
        if(check){
            removeRecomand('formcondition','ipCheckboxAccept')
            return true;
        }else{
            showRecomand('formcondition','(โปรดอ่านและยอมรับเงื่อนไขการสมัครสมาชิก)','ipCheckboxAccept');
            return false;
        }
    }
    function trueIdPwd(id,pwd){
        if(id == ""){
           removeRecomand('ipId','ipId');
           showRecomand('ipId','(Username ใช้ตัวอักษร A-Z,a-z,0-9 ไม่อนุญาติให้ใช้ตัวอักษรพิเศษเช่น _+*^%$/)','ipId') 
           return false;
        }else{
           removeRecomand('ipId','ipId');
           return true;
        }  
    }
    function trueFLName(){
        console.log('Check FristName LastName');
        return true;
    }
    function trueTal(){
        console.log('Check tel');
        return true;
    }
    function trueEmail(){
        console.log('Check Email');
        return true;
    }
    function trueCareer(){
        console.log('Check Career');
        return true;
    }
    function trueGender(){
        console.log('Check Gender');
        
        return true;
    }
    function trueFilePic(){
        console.log('Check File Picture');
        return true;
    }
 
    
    function showRecomand(target,msg,position){
        removeRecomand(target,position);
        window.location.href='#'+target;
        let span = document.createElement('span');
        span.className = "recommend";
        span.setAttribute('id',target+position);
        let textInner = document.createTextNode(msg);
        span.appendChild(textInner);
        document.getElementById(position).parentNode.appendChild(span);
        
    }
    function removeRecomand(target,position){
        let ele = document.getElementById(target+position);
        if(ele){
            ele.remove();
        }
    }
    
    function sendAjax(url,method){
        console.log(url+''+method);
    }
    
    return {
       sendDataRegister : sendData
    }
}();

var SomeThink = {
    id:'9101',
    alertUser : function(msg){
        return console.log('Hi'+msg);
    }
}


