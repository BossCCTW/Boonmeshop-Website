"use strict";

let Navbar = (function () {
  //Navbar DOM
  let $navbar = $('.navbar').find('.navbar-container');
  let $link = $navbar.find('.navbar-link');
  let $webName = $navbar.find('.navbar-webname');

  //register DOM
  let $linkRegister = $link.find('.navbar-link_register');
  let $modalRegisterContainer = $linkRegister.find('.modal-login');
  let $modalRegisterDialog = $modalRegisterContainer.find('.modal-login_content');
  let $closeBtnModalLogin = $modalRegisterDialog.find('.modal-btn-close');

  //download DOM
  let $linkDownload = $link.find('li.navbar-link_download');
  let $modalDownloadContainer = $linkDownload.find('.modal-download');
  let $modalDownloadDialog = $modalDownloadContainer.find('.modal-download_content');
  let $closeBtnModalDownload = $modalDownloadContainer.find('.modal-btn-close');

  //Button Hamburger
  let $btnHamburger = $navbar.find('.navbar-hamburger');

  //Bind event Webname
  $webName.on('click', () => window.location = '/');
  //Bind event register
  $linkRegister.on('click', {
    modalName: $modalRegisterContainer
  }, showModal);
  $closeBtnModalLogin.on('click', {
    modalName: $modalRegisterContainer
  }, closeModal);
  $modalRegisterContainer.on('click', {
    modalName: $modalRegisterContainer
  }, closeModalOutside);
  $modalRegisterDialog.on('click', stopCallParent);
  //Bind event Donwload
  $linkDownload.on('click', {
    modalName: $modalDownloadContainer
  }, showModal);
  $closeBtnModalDownload.on('click', {
    modalName: $modalDownloadContainer
  }, closeModal);
  $modalDownloadContainer.on('click', {
    modalName: $modalDownloadContainer
  }, closeModalOutside);
  $modalDownloadDialog.on('click', stopCallParent);

  //Bind event Hamburger
  $btnHamburger.on('click', toggleShowLink);

  function showModal(event) {
    event.data.modalName.css('display', 'block');
    console.log('Show modal : ' + event.data.modalName[0].className);
  }

  function closeModal(event) {
    stopCallParent(event);
    event.data.modalName.css('display', 'none');
    //โดยปกติแล้วโปรแกรมจะมองว่าการคลิกปุ่มที่อยู่ใน child เป็นการคลิก parentด้วย ถึงทำให้ handler ของ parent ทำงานอีกครั้งหลังจาก handler ของ child จบลง
    //การใช้ stopPropagation เพื่อไม่ให้การ click มีผลต่อ parent ด้วย

    //Propagation หมายถึงการเผยแผ่
    console.log('close by button-close : ' + event.data.modalName[0].className);

  }

  function closeModalOutside(event) {
    stopCallParent(event);
    event.data.modalName.css('display', 'none');
    console.log('close by outside : ' + event.data.modalName[0].className);
  }

  function stopCallParent(event) {
    event.stopPropagation(); //เมื่อมีการคลิกใน dialog จะ ไม่ให้ไปกระทบกับส่วนอื่น
    console.log('click in :', event.currentTarget);
    // console.log('Modal dialog');
  }

  function toggleShowLink() {
    //set การกดปุ่ม hamburger ให้สลับการใช้งาน class Active เพื่อแสดง animation ของ .navbar-hamburger.active (ขีดไหลลง และ ลูกศรเปลี่ยนทิศตาม css)
    $btnHamburger.toggleClass('active');

    $link.toggleClass('active'); //สั่งให้ navbar ใช้คลาส active เพื่อสไลด์ลงมา
  }


})();

let Menu = (function () {})();

let Slideshow = (function () {
  let index = 0;
  let nowIndex = 0;
  let imagesList = [];

  const time = 2000;
  const pathImage = 'assets/imgs/slideshow/';
  const url = 'http://localhost:2000/slideShow';

  //Catch DOM
  let $slideShowContainer = $('.container').find('.banner-slideshow');
  let $slideShow = $slideShowContainer.find('img');
  let $btnBack = $slideShowContainer.find('#slideShowBtnBack');
  let $btnNext = $slideShowContainer.find('#slideShowBtnNext');
  let $selectorContainer = $slideShowContainer.find('.slideshow-selector');

  //Bind event
  $btnBack.on('click', {
    slide: 'back'
  }, setImageSelector);
  $btnNext.on('click', {
    slide: 'next'
  }, setImageSelector);
  $selectorContainer.on('click', 'span', setImageSelector);

  //set default html
  getImages(ResImgsList => {
    imagesList = ResImgsList;
    setAmountSelector(imagesList.length);
    setSlideLoop();
  });


  function getImages(callback) {
    fetchHttp(url, 'GET', '', callback);
  }



  function setSlideLoop() {
    $slideShow.attr('src', pathImage + imagesList[index]);
    nowIndex = index; //backup Real index before index++ 
    setPositionSelector(index);
    if (index < imagesList.length - 1) {
      index++;
    } else {
      index = 0;
    }
    setTimeout(setSlideLoop, time);
  }

  function setAmountSelector(count) {
    for (let i = 0; i < count; i++) {
      $selectorContainer.append(`<span>&bull;</span>`);
    }
  }

  function setImageSelector(event) {

    if (event.data) {
      if (event.data.slide == 'next') {
        if (index > nowIndex) {
          index = nowIndex;
        }
        index = index + 1;
        if (index == imagesList.length) {
          index = 0;
        }
      } else {
        console.log(index, nowIndex);
        if (index > nowIndex) {
          index = nowIndex;
        }
        index = index - 1;
        if (isNaN(index) || index < 0) {
          index = imagesList.length - 1;
        }
      }

    } else {
      let target = $selectorContainer.find('span').index($(event.target));
      index = target;
    }

    $slideShow.attr('src', pathImage + imagesList[index]);
    setPositionSelector(index);
    nowIndex = index;
  }

  function setPositionSelector(indexTarget) {
    for (let i = 0; i < imagesList.length; i++) {
      if (i == indexTarget) {
        $selectorContainer.children().eq(indexTarget).css('color', '#fff');
      } else {
        $selectorContainer.children().eq(i).css('color', 'rgba(0, 0, 0, 0.6)');
      }
    }
  }

})();

let Promotion = (function () {

  //Catch DOM
  let $promotionContainer = $('.container').find('.banner .banner-container-grid .banner-slideshow_promotion');
  let $slideShowImagesContainer = $promotionContainer.find('.promotion-container');
  let $slideItem = $slideShowImagesContainer.children('.promotion-item');
  let $btnBack = $promotionContainer.children('#btnBack');
  let $btnNext = $promotionContainer.children('#btnNext');

  let widthItem = $slideItem.width() + 5;
  let count = 0;
  let lengthOfItem = $slideShowImagesContainer.find('>*').length;



  //Bind event
  $btnBack.on('click', scrollBack);
  $btnNext.on('click', scrollNext);


  function scrollBack() {
    // $slideShowImagesContainer.scrollLeft(setScaleScroll(--count))
    console.log('back scroll');
    
    $slideShowImagesContainer.animate({
      scrollLeft: setScaleScroll(--count)
    });
  }

  function scrollNext() {
    // $slideShowImagesContainer.scrollLeft(setScaleScroll(++count)); 
    console.log('next scroll');
    
    $slideShowImagesContainer.animate({
      scrollLeft: setScaleScroll(++count)
    });
  }

  function setScaleScroll(c) {
    if (c < 0) {
      c = 0;
      count = 0;
    } else if (c > lengthOfItem - 1) {
      c = lengthOfItem - 1;
      count = lengthOfItem - 1;
    }
    return widthItem * c;
  }
})();

let Admin = (function () {
  let $linkToAdminPage = $('.footer-grid').find('.footer-grid-child');
  $linkToAdminPage.on('click', () => {
    window.open('/admin');
  });

})();




function fetchHttp(url, method, data = '', callbackFunc = () => {}) {
  let xhr = new XMLHttpRequest();
  let urlServ = url + data;
  xhr.open(method, urlServ, true);
  xhr.setRequestHeader('Content-type', 'text/plain');
  xhr.onreadystatechange = resFromServ;
  xhr.send();

  function resFromServ() {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      let dataRespond = JSON.parse(xhr.responseText);
      callbackFunc(dataRespond);
    }
  }
}



//  //การส่งข้อมูลด้วยวิธีการ httpRequest AJAX (Javascript Only)
//   function getDataLogin(){
//     //input
//      var inputUserName = document.getElementById('ip-username').value;
//      var inputPassword = document.getElementById('ip-password').value;
//     //span coment user
//      var commentUser = document.getElementsByClassName('commentuser')[0];

//      console.log(inputUserName,inputPassword);
//     //check input null!
//      if(!inputUserName || !inputPassword){
//       console.log('[input] Incorrect');
//       commentUser.textContent = "ผู้ใช้กรอกข้อมูลไม่ครบโปรดตรวจสอบ";
//      }else{
//        //clear comment
//       commentUser.textContent ="";

//       //do Ajax
//       sendDataAjax(inputUserName,inputPassword);
//      }
//   }


//   function sendDataAjax(username,password){
//       var txtUsername = 'username='+username;
//       var txtPass = 'password='+password;
//       var commentUser = document.getElementsByClassName('commentuser')[0];

//       var http = new XMLHttpRequest();
//       var url = 'http://localhost:2000/userlogin';
//       http.overrideMimeType('text/html');
//       http.open('POST',url,true);
//       http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//       http.send(txtUsername+'&'+txtPass);
//       //หากต้องการส่ง parameter ที่ได้จาก input ต่างๆ ครั้งละหลายๆ parameter ให้ใช้
//       //& คั่นละหว่าง parameter ในฟอร์มที่ถูกจะเป็นลักษณะนี้ param1=data1&param2=data2

//       //check state request
//       // 0 การร้องขอ (request) มีปัญหา ไม่สามารถกำหนดค่าเริ่มต้นได้
//       // 1 การร้องขอ (request) ถูกกำหนดขึ้น
//       // 2 การร้องขอ (request) ถูกส่งไปแล้ว
//       // 3 การร้องขอ (request) กำลังประมวลผล
//       // 4 การร้องขอ (request) ให้ผลกลับมาเรียบร้อย
//       http.onreadystatechange = function(){
//         if(http.readyState == 3){
//           console.log('working and process...');
//         }
//         if(http.readyState === 4 && http.status === 200){
//             let inputID = document.getElementById('ip-username').value;
//             //แปลงจาก json ที่ส่งมาจาก server ให้กลายเป็น object
//             let data_fromserv = JSON.parse(http.responseText);
//             if(data_fromserv.status == '400'){
//                 commentUser.innerHTML = '`'+inputID+'` ไม่มีในระบบ';
//                 console.log(data_fromserv.status);
//             }else if(data_fromserv.status == '200'){
//                 deleteFormLogin();
//                 setNewFormLogin(data_fromserv.userpic,data_fromserv.username,data_fromserv.member);
//             }
//         }
//       };  
//   }

//   function deleteFormLogin(){
//       //This Code ใช้สำหรับเพิ่ม โปโตไทป์ remove ให้แก่ object Element และ NodeList เพื่อ สามารถลบ Child ที่อยู่ภายในได้
//       Element.prototype.remove = function() {
//         this.parentElement.removeChild(this);
//       }
//       NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
//         for(var i = this.length - 1; i >= 0; i--) {
//             if(this[i] && this[i].parentElement) {
//             this[i].parentElement.removeChild(this[i]);
//             }
//         }
//       }

//     let oldElement = document.getElementsByClassName("modal-login_inner"); //เลือก element ที่จะลบ
//     oldElement.remove();//ลบ form ล็อคอินออกเมื่อ รหัสผ่านถูกต้อง
//   }

//   function setNewFormLogin(userpic,username,member){
//     let newHtml = `<article class="modal-login-correct"> 
//                       <img src="${userpic}" alt="">
//                       <h3 class="modal-login-correct_title">${username}</h3>
//                       <p class="modal-login-correct_sub_title">Member : ${member}</p>
//                       <div class="bt-closemodal">
//                          <a style="color:#bf4848;" href="#"><div class="t-close"></div>close</a>
//                       </div>
//                     </article>`;//เตรียมข้อมูล แสดง userdata ใช้เทคนิค Template literals

//     let newElement = document.getElementsByClassName('modal-login')[0];
//     newElement.innerHTML = newHtml; //ใส่ช้อมูล user ลงไปใน modal ล็อคอิน
//   }