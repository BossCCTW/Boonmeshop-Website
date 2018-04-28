"use strict";
let menu = (() => {
    const uri = '/menu/';
   
    //DOM List Menu 
    let container = $('#listMenu');
    let menuId ='';
    container.on('click','div>button#btnUpdateMenu',updateMenu);
    container.on('click','div>button#btnDeleteMenu',deleteMenu);

    getAllMenu();
    
    //DOM Modal Update Menu
    let modalMenu = $('#modelUpdateMenu');
    let inputNameTh = modalMenu.find('#ipUpdateNameTh');
    let inputNameEn = modalMenu.find('#ipUpdateNameEn')
    let btnCloseModal = modalMenu.find('#btnClose');
    let btnSaveUpdate = modalMenu.find('#btnSaveUpdateMenu');

    //Bind Event Modal Update
    btnCloseModal.on('click',()=>modalMenu.toggleClass('d-none'));
    btnSaveUpdate.on('click',saveUpdate);



    function saveUpdate(){
        console.log(inputNameTh.val(),inputNameEn.val(),menuId);
        console.log(uri+menuId);
        
        //check null and empty value in modal
        if((inputNameTh.val() != '' && inputNameEn.val() != '') 
            && (inputNameTh.val() != null && inputNameEn.val() != null)){
                if(menuId !='' && menuId != null){
                    // /menu/5ad061f1df4f0816c0781fcb
                    fetch(uri+menuId,{
                        method:'PATCH',
                        headers:{   
                            'Accept':'application/json, text/plain, */*', //set Header for send json
                            'Content-type':'application/json'
                        },
                        body:JSON.stringify({        
                            nameTh:inputNameTh.val(),//set body{ nameTh : test, nameEn :test}
                            nameEn:inputNameEn.val()
                        })
                    })
                    .then((res)=> res.json())
                    .then((data)=>{
                        //data.status
                        //data.result
                        console.log(data);    
                                             
                        modalMenu.toggleClass('d-none');   //display none modal      
                        getAllMenu(); //refresh list Menu  
                    })
                    .catch((err)=>{
                        console.log(err);                     
                    });
                }
        }
    }
   

    function getAllMenu() {  
        fetch(uri)
        .then((res)=> res.json())
        .then((data)=>{
            let output =``;
            
            if(data.length > 0){
                data.forEach(element => {
                    output += `<div class="card col-1 p-0 text-center card-menu" data-id="${element._id}">
                    <img class="card-img-top img-fluid img-menu" src="${element.iconUri}" alt="Card image cap" >
                    <div class="card-body p-0">
                        <p class="card-text m-0 name-th text-truncate">${element.nameTh}</p>
                        <P class="card-text m-0 name-en text-truncate">${element.nameEn}</P>
                        <button type="button" class="btn btn-outline-success w-100 p-0" id="btnUpdateMenu">Edit</button>
                        <button type="button" class="btn btn-outline-danger w-100 p-0" id="btnDeleteMenu">Delete</button>
                        
                    </div>
                   </div>`
                });
                container.html(output);
            }else{
                output = '<h3 class="mx-auto">No Menu item.</h3>'
                container.html(output);
            }
         
            
        })
    }


    function updateMenu(event){
        //get target value in menu item
        let $this =  $(event.target);
        let id = $this.parent().parent().attr('data-id');
        let nameTh = $this.parent().find('.name-th').html();
        let nameEn = $this.parent().find('.name-en').html();

        //setName old and [id]  to input modal
        inputNameTh.val(nameTh);
        inputNameEn.val(nameEn);
        menuId = id;

        //show modal
        modalMenu.toggleClass('d-none');
    }

    function deleteMenu(event){
        //get target value in menu item
        let id = $(event.target).parent().parent().attr('data-id');
        let imgUri = $(event.target).parent().parent().find('.img-menu').attr('src');
        console.log(id); 
        console.log(imgUri);
        
        fetch(uri+id,{
           method:'DELETE',
           headers:{
            //set Header for send json
            'Accept':'application/json, text/plain, */*',
            'Content-type':'application/json'
           },
           body:JSON.stringify({imgUri:imgUri})})
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status == 200){
                alert('ลบข้อมูลสำเร็จ : '+data.result);
                getAllMenu();
            }else{
                alert('ERROR : '+data.status);
            }
        })
        .catch((err)=>alert(err));
    }

    function getMenuById(id) {      
        fetch(uri + id)
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    }

})();
//==================================================================================================
//==================================================================================================
//==================================================================================================
//==================================================================================================
//==================================================================================================
let slideShow = (()=>{
    let uri = '/slideshow/'
    let container = $('.slideshow-container');

    //DOM FORM UPLOAD
    let inputCodeLink = container.find('#inputCodeLinkSlideShow');
    let inputFileImage = container.find('#inputImageSlideshow');
    let previewImageUpload = container.find('#previewUploadSlideshow');
    let btnSaveUpload = container.find('#btnSaveUploadSlideshow');
    let notifyCode = container.find('.notify-txt');
    let notifyImage = container.find('.notify-img');
    let showComplete = container.find('#showComplete');
    let listSlideshow = container.find('#listSlideshow');

    //DOM MODAL UPDATE
    let containerModalUpdate = container.find('#modalUpdateSlide');
    let modalUpdateBody = containerModalUpdate.find('.modal-update_slideshow>.card-body');
    let idUpdateSlide = modalUpdateBody.find('#idUpdateSlide>span');
    let inputTxtUpdateSlide = modalUpdateBody.find('#inputCodeLinkUpdateSlide');
    let imagePreviewInputUpdate = modalUpdateBody.find('#imgShowUpdateSlide');
    let inputFileImageUpdate = modalUpdateBody.find('#inputFileImageUpdateSlide');
    let labelInputImage = modalUpdateBody.find('#labelForinputUpdateSlide');
    let btnCloseModalUpdate = containerModalUpdate.find('#btnClose');
    let btnSaveUpdateSlide = modalUpdateBody.find('#btnSaveUpdateSlide');
    let templateShowSuccessUpdate = `<div class="card col-10 p-4 px-5 text-center text-truncate bg-success text-white position-fixed shadow-material" style="z-index: 1050; top: 50%;left: 50%;transform: translate(-50%, -50%); width:60%;" id="showUpdateSuccess">                     
                                        UPDATE DATA SUCCESSFUL.
                                     </div>`;

    //DOM MODAL DELETE
    let containerModalDelete = container.find('#modalDeleteSlide');
    let idDeleteSlide = containerModalDelete.find('#modalDeleteSlide_Id');
    let btnModalDeleteCancel = containerModalDelete.find('#btnModalDeleteSlide_cancel');
    let btnModalDeleteOk = containerModalDelete.find('#btnModalDeleteSlide_ok');
    let templateShowSuccessDelete = `<div class="card col-10 p-4 px-5 text-center text-truncate bg-danger text-white position-fixed shadow-material" style="z-index: 1050; top: 50%;left: 50%;transform: translate(-50%, -50%); width:60%;" id="showDeleteSuccess">                     
                                        DELETE DATA SUCCESSFUL
                                     </div>`;

    //BIND-EVENT MODAL DELETE
    btnModalDeleteCancel.on('click',()=>{
        containerModalDelete.toggleClass('d-none');
    });
    btnModalDeleteOk.on('click',saveDelete);


    //BIND-EVENT MODAL UPDATE
    btnCloseModalUpdate.on('click',()=>{
        containerModalUpdate.toggleClass('d-none');
        inputFileImageUpdate.val(''); //reset input file 
        inputTxtUpdateSlide.prev('u').remove();//clear alert txt when close
    });

    //check inputfile on change and show preview image select
    inputFileImageUpdate.change(function(){
        readFilePreview(this);
    });

    btnSaveUpdateSlide.on('click',saveUpdateSlide);

    //================================================================

    //check input file image or not and show preview image select
    inputFileImage.change(function(){
        readUrlFile(this);//this == input files
    });
    //Event button save store data and image
    btnSaveUpload.on('click',saveUpload);

    getAllSlide();

    //Bind Event button update and delete
    container.on('click','#listSlideshow>ul>li>button.btn-update-slideshow',setUpdateSlide);
    container.on('click','#listSlideshow>ul>li>button.btn-delete-slideshow',setDeleteSlideshow);

    function saveDelete(){
      
        if(idDeleteSlide.text()){
            console.log(idDeleteSlide.text(),containerModalDelete.attr('data-uriimage'));
            
            fetch(uri+idDeleteSlide.text(),{
                method:'DELETE',
                headers:{
                    'Accept':'application/json, text/plain, */*',
                    'Content-type':'application/json'
                },
                body:JSON.stringify({imgDelete:containerModalDelete.attr('data-uriimage')})
                
            })
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data); 
                if(data.status == 200){
                    containerModalDelete.toggleClass('d-none');
                    getAllSlide(showSuccessDelete);
                }        
            })
            .catch((err)=>alert(err));
        }
        
    
    }

    function saveUpdateSlide(){
        
        let id = idUpdateSlide.html();
        let codeLink = inputTxtUpdateSlide.val();

        if(id != null && id != ''){
            if(codeLink != null && codeLink != ''){
                //clear alert text
                inputTxtUpdateSlide.prev('u').remove();

                let formData  = new FormData();
                console.log('codeLink : '+codeLink);
                
                //map key and data
                formData.append("codeLinkUpdate",codeLink);
                if(inputFileImageUpdate[0].files.length > 0){
                    formData.append("imageUpdateSlide",inputFileImageUpdate[0].files[0]);
                }
                        
                
                fetch(uri+id,{
                    method:'PATCH',
                    body:formData
                })
                .then((res)=>res.json())
                .then((data)=>{
                    console.log(data); 
                    if(data.status == 200){
                        if(data.result.nModified == 1){ //check update data ว่า มีการเปลี่ยนแปลงหรือไม่
                            //หมายถึงหากเขาส่งข้อมูลเดิมไป nModified = 0 คือ ไม่มีการเปลี่ยนแปลง
                            containerModalUpdate.toggleClass('d-none');
                            getAllSlide(showSuccesUpdate);                        
                            inputFileImageUpdate.val('');
                        }else{
                            // nModified = 0 จะไม่ update view
                            containerModalUpdate.toggleClass('d-none');
                        }
                    }                 
                })
                .catch((err)=>alert(err));

            }else{
                //set text alert of null input text befor input element
                $('<u class="text-danger">กรอกโค้ดลิงค์สินค้าในภาพ</u>').insertBefore(inputTxtUpdateSlide);
            }

        }
          
    }
    function showSuccessDelete(){
        console.log('showSuccess');
        $(templateShowSuccessDelete).insertBefore(listSlideshow);
        setTimeout(()=>{
            listSlideshow.prev('div#showDeleteSuccess').remove();
        },2000);
    }
    function showSuccesUpdate(){
        console.log('showSuccess');
        $(templateShowSuccessUpdate).insertBefore(listSlideshow);
        setTimeout(()=>{
            listSlideshow.prev('div#showUpdateSuccess').remove();
        },2000);
    }
    function readFilePreview(input){
        if (input.files && input.files[0]) {
            
            if(input.files[0].type == 'image/png' || input.files[0].type == 'image/jpeg'){     
                let reader = new FileReader();
                reader.readAsDataURL(input.files[0]);

                reader.onload = function(e) {                  
                    imagePreviewInputUpdate.attr('src',e.target.result);          
                }

                btnSaveUpdateSlide.prop('disabled', false); 
                labelInputImage.html('Choose File Image Update');
            }else{
                imagePreviewInputUpdate.attr('src','');
                labelInputImage.html(`<p class="text-danger"><u>This file is not an image file.</u></p>`);
                //js only use document.getElementById('btn').disabled = !cansubmit; //disabled button in javascript
                btnSaveUpdateSlide.prop('disabled', '!cansubmit'); //disabled button in jquery 
            }
        }     
    }

    function setUpdateSlide(event){
        let target = $(event.target).parent().parent();
        let objId= target.find('li>span.obj-id');
        let codeLink = target.find('li>span.code-link');
        let imgSrc = target.find('li>img').attr('src');
        // console.log('update',objId.html(),codeLink.html(),imgSrc);

        

        idUpdateSlide.html(objId.html());
        inputTxtUpdateSlide.val(codeLink.html());
        imagePreviewInputUpdate.attr('src',imgSrc);
        containerModalUpdate.toggleClass('d-none');
  
    }
    function setDeleteSlideshow(event){
        let target = $(event.target).parent().parent();
        let objId= target.find('li>span.obj-id');
        let imgSrc = target.find('li>img').attr('src');
        idDeleteSlide.html(objId.text());
        containerModalDelete.attr('data-uriimage',imgSrc);
        containerModalDelete.toggleClass('d-none');
        console.log('delete');    
    }

    function getAllSlide(callback = ()=>{}){
        
        fetch(uri)
        .then((res) => {       
            return res.json();    
        })
        .then((data)=> {
           if(data.status == 200){
                let output = '';
                data.data.forEach(function(obj){
                    output += `    
                    <ul class="list-group col-6 mb-2 p-0 d-flex flex-column p-1 ">
                        
                        <li class="list-group-item p-1 text-truncate obj-id">ID: <span class="obj-id">${obj._id}</span></li>
                        <li class="list-group-item p-1 text-truncate">CODE-LINK:<span class="code-link">${obj.codeLink}</span></li>
                        <li class="list-group-item text-truncate p-0 d-flex justify-content-center bg-dark">
                        <img style="max-height:180px; object-fit: contain;"
                        src="${obj.imgUri}" class="img-fluid" alt="..."></li>
                        <li class="list-group-item p-0 d-flex flex-wrap flex-md-nowrap">
                        <button type="button" class="btn btn-info btn-block btn-update-slideshow rounded-0">Update</button>
                        <button type="button" class="btn btn-danger col btn-delete-slideshow rounded-0">Delete</button>
                        </li>              
                    </ul>`
                });
                listSlideshow.html(output);
                
           }else{
            listSlideshow.html(`<h3 class=".text-warning">${data.data}</h3>`);
           }
           callback();
        })
        .catch((err)=> console.log(err));
    }


    function readUrlFile(input){
        if (input.files && input.files[0]) {
            
            if(input.files[0].type == 'image/png' || input.files[0].type == 'image/jpeg'){     
                let reader = new FileReader();
                reader.readAsDataURL(input.files[0]);

                reader.onload = function(e) {
                    // $('#blah').attr('src', );
                    previewImageUpload.html(`<div class="card col-12 p-0">
                                    <img class="img-fluid" src="${e.target.result}" alt="Card image cap" style="max-height:300px; object-fit: scale-down;">
                                </div>`);
                }
                btnSaveUpload.prop('disabled', false); 
                notifyImage.html('');
                
            }else{
                previewImageUpload.html(`<p class="text-danger"><u>This file is not an image file.</u></p>`);
                //js only use document.getElementById('btn').disabled = !cansubmit;
                btnSaveUpload.prop('disabled', '!cansubmit'); //in jquery
            }
        }else{
            previewImageUpload.html('');
        }        
    }
    function saveUpload(event){
        event.preventDefault();
       
        if(inputCodeLink.val() != '' && inputCodeLink.val() != null){
            // let arrCodeLink = inputCodeLink.val().split(',');   // set value to array      
            // console.log(arrCodeLink);
            notifyCode.html('');
            
            if(inputFileImage[0].files.length != 0){
                notifyImage.html('');   
                //method get file in element for one file no multiple file
                // console.log(inputFileImage[0].files[0]); !!!
                
                //set formdata
                let formData = new FormData();
                //key: value
                formData.append("codeLink",inputCodeLink.val());
                formData.append("fileImage", inputFileImage[0].files[0]); //!!! input file

                fetch(uri,{
                    method:'POST',
                    body:formData})
                 .then((res)=>res.json())
                 .then((data)=>{
                    console.log(data);    
                    //in save data success => clear input 
                    showSaveComplete('Upload Complete.');  
                    inputCodeLink.val('');   
                    inputFileImage.val('');
                    previewImageUpload.html('');
                    getAllSlide();
                 })
                 .catch((err)=>alert(err));

                
            }else{
                notifyImage.html('โปรดเลือกรูปภาพ');
            }

        }else{
            notifyCode.html('โปรดใส่โค้ดลิงค์สินค้าในภาพด้วย!');
        }  

        function showSaveComplete(text){
            showComplete.html(`<div class="alert alert-success" role="alert">${text}</div>`);
            setTimeout(()=>{
                showComplete.html('');
            },2000);
        }
    }
})();
//============================================================================================================================
//============================================================================================================================
//============================================================================================================================
//============================================================================================================================
//============================================================================================================================
let promotion = (()=>{
    const uri = '/promotion/';

    let container = $('.promotion-container');
    //Upload DOM
    let inputTitleUpload = container.find('#inputTitlePromotion');
    let inputQueryCodeUpload = container.find('#inputQueryCodePromotion');
    let inputImageUpload = container.find('#inputImagePromotion');
    let previewImageUpload = container.find('#previewUploadImage');
    let btnSaveUpload = container.find('#btnSaveUploadPromotion');
    let notifyTitle=  container.find('.notify-title');
    let notifyQueryCode = container.find('.notify-querycode');
    let notifyImage = container.find('.notify-image');
    let showSuccessUpload = `
                 <div class="card col-10 p-4 px-5 text-center text-truncate bg-primary text-white position-fixed shadow-material show" style="z-index: 1050; top: 50%;left: 50%;transform: translate(-50%, -50%); width:60%;" id="showUpdateSuccess">                     
                    Upload Promotion Complete.
                </div>`;

    //Upload Event
    btnSaveUpload.on('click',saveUpload);
    inputImageUpload.change(function(){
        readImagefile(this);
    });


    //List DOM
    let listPromotion = container.find('.promotion-list');
    //List Event
    listPromotion.on('click','ul>li>button.btn-update-promotion',updatePromotion);
    listPromotion.on('click','ul>li>button.btn-delete-promotion',deletePromotion);

    //Update Modal DOM
    let modalUpdate = container.find('.promotion-modal-update');
    let btnCloseModalUpdate = modalUpdate.find('.btn-close-modal');
    let idUpdate = modalUpdate.find('#idUpdatePromotion>span');
    let inputTitleUpdate = modalUpdate.find('#inputTitleUpdatePromotion');
    let inputQueryCodeUpdate = modalUpdate.find('#inputQueryCodePromotion');
    let inputFileImageUpdate = modalUpdate.find('#inputFileImageUpdateSlide');
    let previewImageUpdate = modalUpdate.find('#imagePreviewUpdatePromotion');
    let btnSaveUpdate = modalUpdate.find('#btnSaveUpdatePromotion');
    let notifyUpdateTitle = modalUpdate.find('.notify-update-title');
    let notifyUpdateQueryCode = modalUpdate.find('.notify-update-querycode');
    let notifyUpdateImage = modalUpdate.find('.notify-update-image');
    

    //Update Event
    btnCloseModalUpdate.on('click',()=>{ 
        inputFileImageUpdate.val(''); 
        modalUpdate.toggleClass('d-none')
        notifyUpdateTitle.text('');
        notifyUpdateQueryCode.text('');
        notifyUpdateImage.text('');
    });

    inputFileImageUpdate.change(function(){
        readImageUpdate(this);
    });
    btnSaveUpdate.on('click',saveUpdate);

    //Delete Modal DOM
    let modalDelete  = container.find('.promotion-modal-delete');
    let btnCancel = modalDelete.find('#btnCancelModalDeletePromotion');
    let btnSaveDelete = modalDelete.find('#btnSaveDeletePromotion');
    let idDeletePromotion = modalDelete.find('#idDeletePromotion');
    let tempateShowDeleteSuccess = `
    <div class="card col-10 p-4 px-5 text-center text-truncate bg-danger text-white position-fixed shadow-material show" style="z-index: 1050; top: 50%;left: 50%;transform: translate(-50%, -50%); width:60%;" id="showUpdateSuccess">                     
       Delete Promotion Success.
   </div>`;

    //Delete Modal Event 
    btnCancel.on('click',()=>{
        modalDelete.toggleClass('d-none');
    });
    btnSaveDelete.on('click',saveDeletePromotion);

    
    getAllPromotion();

    function saveDeletePromotion(){
        if(idDeletePromotion.text()){
            let id = idDeletePromotion.text();
            fetch(uri+id,{
                method:'DELETE'
            })
            .then((res)=>res.json())
            .then((data)=>{
                if(data.status == 200){
                    getAllPromotion();
                    showSuccess(tempateShowDeleteSuccess,listPromotion);
                    
                }
                modalDelete.toggleClass('d-none');
            })
            .catch((err)=>console.log(err));
        }  
    }

    function deletePromotion(event){
        console.log('Delete');
        let target = $(event.target).parent().parent();
        let id = target.find('li>span.promo-id').text();
        idDeletePromotion.text(id);
        modalDelete.toggleClass('d-none');
    }

    function saveUpdate(event){
        
        if(checkInput()){
            let id = idUpdate.text();
            let title = inputTitleUpdate.val();
            let querycode = inputQueryCodeUpdate.val();
            let formData = new FormData();
            if(inputFileImageUpdate[0].files.length > 0){
                formData.append('titleUpdate',title);
                formData.append('queryCodeUpdate',querycode);
                formData.append('imageUpdatePromo',inputFileImageUpdate[0].files[0]);
            }else{
                formData.append('titleUpdate',title);
                formData.append('queryCodeUpdate',querycode);
            }
            
        
            fetch(uri+id,{
                method:'PATCH',
                body:formData
            })
            .then((res)=>res.json())
            .then((data)=>{
                //data.status
                //data.result
                if(data.status == 200){
                    if(data.result.nModified == 1){
                        getAllPromotion();
                    }
                    
                }
                modalUpdate.toggleClass('d-none');
                console.log(data);           
            })
            .catch((err)=>console.log(err));
        }

       function checkInput(){
           if((inputTitleUpdate.val() !='' && inputTitleUpdate.val() != null) &&
                (inputQueryCodeUpdate.val() !='' &&  inputQueryCodeUpdate.val() != null)){
                notifyUpdateTitle.text('');
                notifyUpdateQueryCode.text('');
               return true;
           }else{
                if(inputTitleUpdate.val() == '' || inputTitleUpdate.val() == null){
                    notifyUpdateTitle.text('โปรดกรอกข้อมูลในช่อง Title');
                }else{
                    notifyUpdateTitle.text('');
                }

                if(inputQueryCodeUpdate.val() == '' ||  inputQueryCodeUpdate.val() == null){
                    notifyUpdateQueryCode.text('โปรดกรอกข้อมูลในช่อง QueryCode');
                }else{
                    notifyUpdateQueryCode.text('');
                }

               return false;
           }
           
       }
    }

    function updatePromotion(event){
        let target = $(event.target).parent().parent();
        let id = target.find('li>span.promo-id').text();
        let title = target.find('li>span.promo-title').text();
        let queryCode = target.find('li>span.promo-querycode').text();
        let imgUri = target.find('li>img.img-update').attr('src');
        

        idUpdate.text(id);
        inputTitleUpdate.val(title);
        inputQueryCodeUpdate.val(queryCode);
        previewImageUpdate.attr('src',imgUri);
        inputFileImageUpdate.val('');
        modalUpdate.toggleClass('d-none');
        console.log('Update');      
    }
    

    function saveUpload(){

        if(checkInput()){
            console.log('input are already');
            let title = inputTitleUpload.val();
            let queryCode = inputQueryCodeUpload.val();
            let fileImage = inputImageUpload[0].files[0];       
            
            let formData = new FormData();
            formData.append('titlePromo',title);
            formData.append('queryCodePromo',queryCode);
            formData.append('imagePromo',fileImage);
            fetch(uri,{
                method:'POST',
                body:formData
            })
            .then((res)=>res.json())
            .then((data)=>{
                //data.status
                //data.result
                if(data.status == 200){
                    getAllPromotion();
                    inputTitleUpload.val('');
                    inputQueryCodeUpload.val('');
                    previewImageUpload.html('');
                    showSuccess(showSuccessUpload,listPromotion);
                }
                console.log(data);           
            })
            .catch((err)=>console.log(err));
            

        }

        function checkInput(){
            if((inputTitleUpload.val() != '' && inputTitleUpload.val() != null) && 
            (inputQueryCodeUpload.val() != '' && inputQueryCodeUpload != null) && (inputImageUpload[0].files.length != 0)){
                notifyTitle.text('');
                notifyQueryCode.text('');
                notifyImage.text('');
                return true;
            }else{
                if(inputTitleUpload.val() == '' || inputTitleUpload.val() == null){
                    notifyTitle.text('โปรดกรอก Title ของโปรโมชั่น');
                }else{
                    notifyTitle.text('');
                }
    
                if(inputQueryCodeUpload.val() == '' || inputQueryCodeUpload.val() == null){
                    notifyQueryCode.text('โปรดกรอก Query Code ของสินค้าในโปรโมชั่น');
                }else{
                    notifyQueryCode.text('');
                }

                if(inputImageUpload[0].files.length <= 0){
                    notifyImage.text('โปรดเลือกรูปภาพของโปรโมชั่น');
                }else{
                    notifyImage.text('');
                }
                return false;
            }    
        }
    }

    function readImagefile(input){
        if (input.files && input.files[0]) {
            if(input.files[0].type == 'image/png' || input.files[0].type == 'image/jpeg'){     
                let reader = new FileReader();
                reader.readAsDataURL(input.files[0]);

                reader.onload = function(e) {                                    
                    previewImageUpload.html(`<img style="max-height:230px; object-fit: scale-down;"
                                src="${e.target.result}" class="img-fluid w-100" alt="">`);          
                }

                btnSaveUpload.prop('disabled', false); 
                notifyImage.text('');
            }else{
                notifyImage.text('This file is not an image file.');
                previewImageUpload.html('');
                
                //js only use document.getElementById('btn').disabled = !cansubmit; //disabled button in javascript
                btnSaveUpload.prop('disabled', '!cansubmit'); //disabled button in jquery 
            }
        }else{
            notifyImage.text('โปรดเลือกรูปภาพของโปรโมชั่น');
            previewImageUpload.html('');
        }     
    }
    function getAllPromotion(){
  
        fetch(uri)
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status == 200){ 
                let output = ''
                data.data.forEach((item)=>{
                    output += `<ul class="list-group col-6 mb-2 d-flex flex-column p-1">              
                                    <li class="list-group-item p-1 text-truncate obj-id">ID: <span class="promo-id">${item._id}</span></li>
                                    <li class="list-group-item p-1 text-truncate">Title: <span class="promo-title">${item.title}</span></li>
                                    <li class="list-group-item p-1 text-truncate">QueryCode:<span class="promo-querycode">${item.queryCode}</span></li>
                                    <li class="list-group-item text-truncate p-0 d-flex justify-content-center bg-dark">
                                        <img style="max-height:180px; object-fit: contain;"
                                        src="${item.imageUri}" class="img-fluid img-update" alt="imag Promotion"></li>
                                    <li class="list-group-item p-0 d-flex flex-wrap flex-md-nowrap">
                                    <button type="button" class="btn btn-info btn-block btn-update-promotion rounded-0">Update</button>
                                    <button type="button" class="btn btn-danger col btn-delete-promotion rounded-0">Delete</button>
                                    </li>              
                                </ul>`;
                });
                listPromotion.html(output);
            }
          
           
        })
        .catch((err)=>console.log(err));
    }

    function readImageUpdate(input){
        if (input.files && input.files[0]) {
            if(input.files[0].type == 'image/png' || input.files[0].type == 'image/jpeg'){     
                let reader = new FileReader();
                reader.readAsDataURL(input.files[0]);

                reader.onload = function(e) {                                    
                    previewImageUpdate.attr('src',e.target.result);  
                }

                btnSaveUpdate.prop('disabled', false); 
                notifyUpdateImage.text('');
            }else{
                notifyUpdateImage.text('This file is not an image file.');
                previewImageUpdate.attr('src','');
                //js only use document.getElementById('btn').disabled = !cansubmit; //disabled button in javascript
                btnSaveUpdate.prop('disabled', '!cansubmit'); //disabled button in jquery 
            }
        }else{
            notifyUpdateImage.text('โปรดเลือกรูปภาพที่ต้องการแก้ไข');
            previewImageUpdate.attr('src',''); 
        }   
    }

    function showSuccess(template,element){
        $(template).insertBefore(element);
        setTimeout(() => {
            element.prev('div.show').remove();
        }, 2000);
    }
    
})();
// =================================================================================================================
// =================================================================================================================
// =================================================================================================================
// =================================================================================================================
// =================================================================================================================
let material = (()=>{
    const uri = '/material/'
    let container = $('.material-container');

    //DOM Upload
    let uploadContainer = container.find('.material-upload');
    let inputNameTh = uploadContainer.find('#inputNameThMaterial');
    let inputNameEn = uploadContainer.find('#inputNameEnMaterial');
    let btnSaveUpload = uploadContainer.find('#btnSaveUploadMaterial');
    let notifyNameTh = uploadContainer.find('.notify-name-th');
    let notifyNameEn = uploadContainer.find('.notify-name-en');
    //Event Upload
    btnSaveUpload.on('click',saveUpload);

    //DOM List
    let listMaterial = container.find('.material-list');
    //Event List
    listMaterial.on('click','div>div>div>a.btn-update-material',setUpdate);
    listMaterial.on('click','#btnDeleteMaterial',setDelete);

    //DOM Update
    let modalUpdate = container.find('#modalUpdateMaterial');
    let btnCloseUpdate = modalUpdate.find('.btn-close-modal');
    let idUpdate = modalUpdate.find('.id-update');
    let inputNameThUpdate = modalUpdate.find('.input-update-nameth');
    let inputNameEnUpdate = modalUpdate.find('.input-update-nameen');
    let btnSaveUpdate = modalUpdate.find('.btn-save-update');
    let notifyUpdate = modalUpdate.find('.notify-update');
    //Event Update
    btnCloseUpdate.click(()=>{modalUpdate.toggleClass('d-none')});
    btnSaveUpdate.click(saveUpdate);

    //DOM Delete
    let modalDelete = container.find('#modalDeleteMaterial');
    let idDelete = modalDelete.find('#idDeleteMaterial');
    let btnCancelDelete = modalDelete.find('.btn-cancel');
    let btnSaveDelete = modalDelete.find('.btn-save-delete');

    //Event Delete 
    btnCancelDelete.click(()=>{
        modalDelete.toggleClass('d-none');
    });
    btnSaveDelete.click(saveDelete);
    
    getAllMaterial();
    function saveDelete(){
        let id = idDelete.text();
        if(id){
            fetch(uri+id,{
                method:'DELETE'
            })
            .then((res)=>res.json())
            .then((data)=>{
                if(data.status == 200){
                    getAllMaterial();

                }else{
                    console.log(data);
                    
                }
                modalDelete.toggleClass('d-none');
            })
        }
    }
    function saveUpdate(){
        if((inputNameThUpdate.val() != '' && inputNameThUpdate.val() != null) && 
        (inputNameEnUpdate.val() != '' && inputNameEnUpdate.val != null)){
            notifyUpdate.text('')
            
            if(idUpdate.text()){
                let id = idUpdate.text();
                let nameTh = inputNameThUpdate.val();
                let nameEn = inputNameEnUpdate.val();
                fetch(uri+id,{
                    method:'PATCH',
                    headers:{'Accept':'application/json, text/plain, */*',
                            'Content-type' : 'application/json'
                    },
                    body: JSON.stringify({
                        nameThUpdate:nameTh,
                        nameEnUpdate:nameEn
                    })
                })
                .then((res)=>res.json())
                .then((data)=>{
                    console.log(data); 
                    if(data.result.nModified == 1){
                        getAllMaterial()
                    }
                    modalUpdate.toggleClass('d-none');          
                })
                .catch((err)=>console.log(err))
            }
            
        }else{
            notifyUpdate.text('กรอกข้อมูลไม่ครบ');
        }
    }

    function setUpdate(event){
        event.preventDefault();

        let target = $(event.target).parent().parent();
        let id = target.find('div.card-header>div>span.id').text();
        let nameTh = target.find('div.card-body>p.nameth').text();
        let nameEn = target.find(' div.card-body>p.nameen').text();
                
        idUpdate.text(id);
        inputNameThUpdate.val(nameTh);
        inputNameEnUpdate.val(nameEn);

        modalUpdate.toggleClass('d-none');
        console.log('Update Material');
        
    }
    function setDelete(event){
        console.log('Delete Material');
        let target = $(event.target).parent().parent();
        let id = target.find('span.id').text();
        console.log(id);
        
        idDelete.text(id);

        modalDelete.toggleClass('d-none');
    }
    function saveUpload(){
           
        if(checkInput()){
            let nameTh  = inputNameTh.val();
            let nameEn = inputNameEn.val();
            fetch(uri,{
                method:'POST',
                headers: {
                    'Accept' :'application/json, text/plain, */*',
                    'Content-type' :' application/json'
                },
                body:JSON.stringify({
                    nameTh:nameTh,
                    nameEn:nameEn
                    })
            })
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data);    
                if(data.status == 200){
                    getAllMaterial();
                    inputNameTh.val('');
                    inputNameEn.val('');
                } 
            })
            .catch((err)=>{
                console.log(err);
                
            });
        }

        function checkInput(){
            if((inputNameTh.val() != '' && inputNameTh.val() != null) && 
                (inputNameEn.val() != '' && inputNameEn.val() != null)){
                    notifyNameTh.text('');
                    notifyNameEn.text('');
                return true;
            }else{

                if(inputNameTh.val() == '' || inputNameTh.val() == null){
                    notifyNameTh.text('โปรดกรอกชื่อวัสดุ ไทย');
                }else{
                    notifyNameTh.text('');
                }

                if(inputNameEn.val() == '' || inputNameEn.val() == null){
                    notifyNameEn.text('Please add material name english');
                    console.log('null');
                    
                }else{
                    notifyNameEn.text('');
                }

                return false;
            }
        }
    }

    function getAllMaterial(){
        fetch(uri)
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status == 200){
                let output = ''
                
                $.each(data.data,(key,value)=>{     
                    output +=` <div class="col-2 p-1">
                                    <div class="card mb-3 col-12 p-0 text-center mr-1" style="max-width: 18rem;">
                                            <div class="card-header d-flex p-2">
                                                <div class="col-8 p-0 text-truncate">ID: <span class="id">${value._id}</span></div>
                                                <button type="button" class="close col-4 btn-close-modal" aria-label="Close" id="btnDeleteMaterial">
                                                        <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="card-body p-2">
                                            <p class="card-text mb-1 nameth">${value.nameTh}</p>
                                            <p class="card-text nameen">${value.nameEn}</p>
                                            </div>
                                            <div class="card-footer bg-white  p-2">
                                                <a href="#" class="card-link btn-update-material">Update</a>                                         
                                            </div>        
                                    </div>    
                                </div>`
                });
                listMaterial.html(output);
            }else{
                listMaterial.html(data.data);
            }
           
        });
    }


})();

let product = (()=>{
    const uri = '/product/'
    const urlfiler = new URL('http://localhost:2000/product/filter');
    const container = $('#productContainer');
    let btnSaveUpload = container.find('#btnSaveUploadProduct');
    btnSaveUpload.click(()=>{
        let params = {name :'chanin',lastname:'sitthibunrueang'};
        url.search = new URLSearchParams(params)
        fetch(url)
        .then(res => res.json())
        .then(data => console.log(data));
     
    });
})();