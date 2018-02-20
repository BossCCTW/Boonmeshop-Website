"use strict";
  $(document).ready(function(){
    setEventBtHamburger();
    setEventMaketFilter();
    //set การกดปุ่ม hamburger ให้สลับการใช้งาน class Active เพื่อแดวง Navbar
    function setEventBtHamburger(){
      $('.navbar-hamburger').click(function(){
          $('.navbar-hamburger').toggleClass('active');
          $('.navbar-link').toggleClass('active');
      });
    }
    function setEventMaketFilter(){
   
    }

  
   
  });


 //การส่งข้อมูลด้วยวิธีการ httpRequest AJAX (Javascript Only)
  function getDataLogin(){
    //input
     var inputUserName = document.getElementById('ip-username').value;
     var inputPassword = document.getElementById('ip-password').value;
    //span coment user
     var commentUser = document.getElementsByClassName('commentuser')[0];

     console.log(inputUserName,inputPassword);
    //check input null!
     if(!inputUserName || !inputPassword){
      console.log('[input] Incorrect');
      commentUser.textContent = "ผู้ใช้กรอกข้อมูลไม่ครบโปรดตรวจสอบ";
     }else{
       //clear comment
      commentUser.textContent ="";

      //do Ajax
      sendDataAjax(inputUserName,inputPassword);
     }
  }

  
  function sendDataAjax(username,password){
      var txtUsername = 'username='+username;
      var txtPass = 'password='+password;
      var commentUser = document.getElementsByClassName('commentuser')[0];

      var http = new XMLHttpRequest();
      var url = 'http://localhost:2000/userlogin';
      http.overrideMimeType('text/html');
      http.open('POST',url,true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      http.send(txtUsername+'&'+txtPass);
      //หากต้องการส่ง parameter ที่ได้จาก input ต่างๆ ครั้งละหลายๆ parameter ให้ใช้
      //& คั่นละหว่าง parameter ในฟอร์มที่ถูกจะเป็นลักษณะนี้ param1=data1&param2=data2

      //check state request
      // 0 การร้องขอ (request) มีปัญหา ไม่สามารถกำหนดค่าเริ่มต้นได้
      // 1 การร้องขอ (request) ถูกกำหนดขึ้น
      // 2 การร้องขอ (request) ถูกส่งไปแล้ว
      // 3 การร้องขอ (request) กำลังประมวลผล
      // 4 การร้องขอ (request) ให้ผลกลับมาเรียบร้อย
      http.onreadystatechange = function(){
        if(http.readyState == 3){
          console.log('working and process...');
        }
        if(http.readyState === 4 && http.status === 200){
            let inputID = document.getElementById('ip-username').value;
            //แปลงจาก json ที่ส่งมาจาก server ให้กลายเป็น object
            let data_fromserv = JSON.parse(http.responseText);
            if(data_fromserv.status == '400'){
                commentUser.innerHTML = '`'+inputID+'` ไม่มีในระบบ';
                console.log(data_fromserv.status);
            }else if(data_fromserv.status == '200'){
                deleteFormLogin();
                setNewFormLogin(data_fromserv.userpic,data_fromserv.username,data_fromserv.member);
            }
        }
      };  
  }

  function deleteFormLogin(){
      //This Code ใช้สำหรับเพิ่ม โปโตไทป์ remove ให้แก่ object Element และ NodeList เพื่อ สามารถลบ Child ที่อยู่ภายในได้
      Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
      }
      NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for(var i = this.length - 1; i >= 0; i--) {
            if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
            }
        }
      }

    let oldElement = document.getElementsByClassName("modal-login_inner"); //เลือก element ที่จะลบ
    oldElement.remove();//ลบ form ล็อคอินออกเมื่อ รหัสผ่านถูกต้อง
  }

  function setNewFormLogin(userpic,username,member){
    let newHtml = `<article class="modal-login-correct"> 
                      <img src="${userpic}" alt="">
                      <h3 class="modal-login-correct_title">${username}</h3>
                      <p class="modal-login-correct_sub_title">Member : ${member}</p>
                      <div class="bt-closemodal">
                         <a style="color:#bf4848;" href="#"><div class="t-close"></div>close</a>
                      </div>
                    </article>`;//เตรียมข้อมูล แสดง userdata ใช้เทคนิค Template literals

    let newElement = document.getElementsByClassName('modal-login')[0];
    newElement.innerHTML = newHtml; //ใส่ช้อมูล user ลงไปใน modal ล็อคอิน
  }


 