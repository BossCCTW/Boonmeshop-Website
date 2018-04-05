"use strict";
let Navbar = (() => {
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

  return {
    stopCallParent: stopCallParent
  }
})();

let Menu = (() => {})();

let Slideshow = (() => {
  let index = 0;
  let nowIndex = 0;
  let imagesList = [];

  const time = 2000;
  const pathImage = 'assets/imgs/slideshow/';
  const url = 'http://localhost:2000/api/slideShow';

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

let Promotion = (() => {

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

let Filter = (() => {
  let $HeaderContainer = $('.market').children('.market-header');
  let $titleHeader = $HeaderContainer.find('.market-header_titlebar-title');
  let $buttonFilter = $HeaderContainer.find('.market-header_titlebar-button');
  let $filterContainer = $HeaderContainer.find('.market-filterbar');
  let $filterContent = $filterContainer.find('.filterbar-content');

  $buttonFilter.on('click', showFilter);
  $filterContainer.on('click', closeFilter);
  $filterContent.on('click', Navbar.stopCallParent);

  function showFilter(event) {
    $filterContainer.css('display', 'block');

  }

  function closeFilter(event) {
    $filterContainer.css('display', 'none');

  }

})();

let Market = (() => {
  let percentProgress = 0;
  let loopTimoutProgress;

  //market
  let $marketContainer = $('.market').find('.market-body>.market-item-container');
  let $cardProduct = $marketContainer.children('.card');

  //progressbar
  let $progressBarContainer = $('.market').children('.progress-container');
  let $progressBarLoader = $progressBarContainer.find('.progress-bar');
  let $progressBarBtnClose = $progressBarContainer.find('.progress-bar_button-close');


  //product-detail
  let $productDetailContainer = $('.product-detail');
  let $btnCloseDetail = $productDetailContainer.find('.detail-content>.close-btn');

  let $detailDataContainer = $productDetailContainer.find('.detail-data');
  let $btnTabContentDetail = $detailDataContainer.find('.tabbar .tabbar-content');
  let $btnTabRatingDetail = $detailDataContainer.find('.tabbar .tabbar-rating');

  let $bodyTabDetailContainer = $detailDataContainer.find('.body-container');
  let $tabContent = $detailDataContainer.find('.content');
  let $tabRating = $detailDataContainer.find('.rating');
  let $btnBuyProduct = $detailDataContainer.find('.button-confirmbuy');
  let $btnTabContentMobile = $detailDataContainer.find('.tabbar-mobile .tabbar-content');
  let $btnTabRatingMobile = $detailDataContainer.find('.tabbar-mobile .tabbar-rating')
  let $btnCloseTabMobile = $bodyTabDetailContainer.find('.close-tab-btn');



  let imgSelected = 0;
  let imgOrigin = '';
  let $imgShowBackground = $productDetailContainer.find('.img-show');
  let $imgShow = $imgShowBackground.find('img');
  let $imgSlideContainer = $productDetailContainer.find('.img-slider');
  let $imgItem = $imgSlideContainer.children('div');



  // SLIDESHOW IMG 
  $imgItem.on('click', setImageShowOnClick);

  //CARD PRODUCT MARKET
  $cardProduct.on('click', fetchDataDetail); // << set default template

  //PROGRESSBAR
  $progressBarBtnClose.on('click', cancelProgressBar);

  //DETAIL PRODUCT
  $btnCloseDetail.on('click', closeProductDetail);
  $btnTabContentDetail.on('click', {
    target: 'content'
  }, showTabTarget);
  $btnTabRatingDetail.on('click', {
    target: 'rating'
  }, showTabTarget);
  $btnBuyProduct.on('click', buyProduct);

  $btnTabContentMobile.on('click', {
    target: 'Detail'
  }, showTabDetailMobile);
  $btnTabRatingMobile.on('click', {
    target: 'Rating'
  }, showTabDetailMobile);
  $btnCloseTabMobile.on('click', closeTabMobile);

  function showTabDetailMobile(event) {
    if (event.data.target == 'Detail') {
      console.log('Mobile content');
      $bodyTabDetailContainer.css('display', 'flex');
      $tabContent.css('display', 'block');
      $tabRating.css('display', 'none');
    } else {
      console.log('Mobile Rating');
      $bodyTabDetailContainer.css('display', 'flex');
      $tabRating.css('display', 'block');
      $tabContent.css('display', 'none');
    }
  }

  function closeTabMobile() {
    if ($tabContent.css('display') == 'block') {
      $tabContent.css('display', 'none');
    } else {
      $tabRating.css('display', 'none');
    }
    $bodyTabDetailContainer.css('display', 'none');
    $bodyTabDetailContainer.css('display', 'flex');

  }


  function fetchDataDetail(event) {
    let idProduct = event.currentTarget.getAttribute('data-id');
    showProgressbar();
  }


  function showProgressbar() {
    if ($progressBarContainer.css('display') == 'none') {
      $progressBarContainer.css('display', 'flex');
    }

    if (percentProgress < 100) {
      percentProgress += 1;
      $progressBarLoader.css('width', percentProgress + '%');
      // console.log(percentProgress);
      loopTimoutProgress = setTimeout(showProgressbar, 3);
    } else {
      $progressBarContainer.css('display', 'none');
      percentProgress = 0;
      showProductDetail();
    }
  }

  function cancelProgressBar(event) {
    clearTimeout(loopTimoutProgress);
    $progressBarContainer.css('display', 'none');
    percentProgress = 0;
  }

  function showProductDetail() {
    //set default Tab Active
    $btnTabContentDetail.addClass('active'); //ตั้งให้ content detail แสดงเป็นค่าเริ่มต้น
    setTabActive();
    //set default Image Frist function
    setDefaultImageShow($imgSlideContainer.find('div:nth-child(1) img').attr('src')); //ส่ง src รูปแรกให้ไปแสดงเป็นรูปใหญ่

    $productDetailContainer.css('display', 'flex');
  }

  function closeProductDetail() {
    $productDetailContainer.css('display', 'none');
  }

  function showTabTarget(event) {
    console.log(event.data.target);
    if (event.data.target == 'rating') { //Click Rating
      if ($btnTabContentDetail.hasClass('active')) {
        $btnTabRatingDetail.toggleClass('active');
        $btnTabContentDetail.removeClass('active');
      }

    } else { // Clcik Content
      if ($btnTabRatingDetail.hasClass('active')) {
        $btnTabContentDetail.toggleClass('active');
        $btnTabRatingDetail.removeClass('active');
      }
    }
    setTabActive();
  }

  function setTabActive() {
    if ($btnTabContentDetail.hasClass('active')) {
      $tabContent.css('display', 'block');
      $tabRating.css('display', 'none');
    } else {
      $tabRating.css('display', 'block');
      $tabContent.css('display', 'none');
    }
  }

  function buyProduct() {
    alert('Buy it ?');
  }

  function setDefaultImageShow(imgUrl = null) {
    imgOrigin = imgUrl;


    if (imgUrl) {
      let urlImageFirst = imgUrl;

      $imgShowBackground.css('background-image', `url(${urlImageFirst})`);
      $imgShow.attr('src', urlImageFirst);
      $imgSlideContainer.children('div').eq(imgSelected).addClass('active');
      console.log('set default' + imgOrigin);
    }
    console.log(imgSelected);

  }

  function setImageShowOnClick(event = null) {
    console.log(event.target);

    if (event.target.getAttribute('src')) {
      //ตรวจสอบว่า รูปที่กดไม่ซ้ำกับรูปเดิม จะได้ไม่ต้อง เซ็ตรูปใหม่
      if (imgOrigin != event.target.getAttribute('src')) {
        $imgShow.attr('src', event.target.getAttribute('src'));
        $imgShowBackground.css('background-image', `url(${event.target.getAttribute('src')})`);
        imgOrigin = event.target.getAttribute('src');

        //ตรวจสอบตำแหน่งที่คลิกว่าเป็น div ใด
        let target = $(event.target).closest('div');
        // หา index ที่คลิก
        let newItem = $imgSlideContainer.find('div').index(target);
        //เพิ่ม Class active 
        $imgSlideContainer.children('div').eq(newItem).toggleClass('active');
        //ลบ Active จาก div เดิมออก
        $imgSlideContainer.children('div').eq(imgSelected).toggleClass('active');
        //เก็บตำแหน่งใหม่ไว้
        imgSelected = newItem;
        console.log('set');
      }

    }

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