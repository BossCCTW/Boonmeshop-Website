

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
                    output += `<div class="card col-2 p-0 text-center card-menu" data-id="${element._id}">
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
                                            <p class="card-text mb-1 nameth text-truncate">${value.nameTh}</p>
                                            <p class="card-text nameen text-truncate">${value.nameEn}</p>
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
    const container = $('#productContainer');
    

    //Upload DOM
    let uploadContainer = container.find('.product-upload');
    let inputProductName = uploadContainer.find('#inputpProductName');
    let inputPriceProduct = uploadContainer.find('#inputPriceProduct');
    let inputImageAvatar = uploadContainer.find('#inputImgAvatarProduct');
    let previewImageAvatarUpload = uploadContainer.find('#previewImageUploadAvatar')
    let inputImageGallery = uploadContainer.find('#inputImgGalleryProduct');
    let previewImageGalleyUpload = uploadContainer.find('#previewImageUploadGallery');
    let selectorTypeProduct = uploadContainer.find('#inputTypeProduct');
    let selectorMaterialProduct = uploadContainer.find('#inputSelectMaterialProduct');
    let listMaterialUpload = uploadContainer.find('#listMaterialUpload');
    let payBeforeCheckBox = uploadContainer.find('#checkBoxPayBefore');
    let payAfterCheckBox = uploadContainer.find('#checkBoxPayAfter');
    let normalTranspotCheckBox = uploadContainer.find('#checkboxNormalTranspot');
    let registerTranspotCheckBox = uploadContainer.find('#checkboxRegisterTranspot');
    let emsTranspotCheckBox = uploadContainer.find('#checkboxEmsTranspot');
    let selectorStatusProduct = uploadContainer.find('#selectorStatusProduct');
    let inputPercentProduct = uploadContainer.find('#inputPercentProduct');
    let inputAmountProduct = uploadContainer.find('#inputAmountProduct');
    let inputInformationProduct = uploadContainer.find('#inputInformationProduct');
    let btnSaveUpload = uploadContainer.find('#btnSaveUploadProduct');

    fetchType(); //get type list set to option selector
    fetchMaterial();//get material list

    //Upload Event
    selectorTypeProduct.on('change',getValueType);
    selectorMaterialProduct.on('click','button',addMaterialtoList);
    inputImageAvatar.change(function(){ //set Preview image Avatar when select image
        readFileAvatarToPreview(this)
    });
    inputImageGallery.change(function(){
        readFileGalleryToPreview(this);
    });
    listMaterialUpload.on('click','div.alert>button.close',deleteMaterialItem); //delete item material [dynamic list]
    btnSaveUpload.on('click',saveUpload);
    


    //List product DOM 
    let list = container.find('#listProduct');
    fetchList();

    //List Event
    list.on('click','div>ul>li.link-detail',showDetail);
    list.on('click','div>ul>li>button.update',showModalUpdate);
    list.on('click','div>ul>li>button.delete',showModalDelete)
    
    //DOM DETAIL Product
    let containerDetail = container.find('.product-detail');
    let btnCloseDetail = containerDetail.find('button.close');
    let imgAvatarDetail = containerDetail.find('#imgAvatarDetail>img');
    
    let listImgGalleyDetail = containerDetail.find('#listImgGalleryDetail');
    let statusDetail = containerDetail.find('#stautusDetail');
    let nameDetail = containerDetail.find('#nameDetail');
    let idDetail = containerDetail.find('#idDetail');
    let priceDetail = containerDetail.find('#priceDetail');
    let typeDetail = containerDetail.find('#typeDetail');
    let materailDetail = containerDetail.find('#materialDetail');
    let paymentDetail = containerDetail.find('#paymentDetail');
    let transpotDetail = containerDetail.find('#transpotDetail');
    let informationDetail = containerDetail.find('#informationDetail');

    //Event Detail Product
    btnCloseDetail.click(()=>{
        containerDetail.toggleClass('d-none');
    });
    listImgGalleyDetail.on('click','img',setImageOnTopDetail);

    //Update DOM
    let containerModalUpdate = container.find('#updateProductContainer');
    let btnCloseUpdate =containerModalUpdate.find('button.close-modal-update');
    let idUpdate = containerModalUpdate.find('#idUpdateProduct');
    let nameUpdate = containerModalUpdate.find('#nameUpdateProduct');
    let priceUpdate = containerModalUpdate.find('#priceUpdateProduct');
    let containerPreviewAvatarUpdate = containerModalUpdate.find('#containerPreviewAvatarUpdate');
    let previewAvatarUpdate = containerModalUpdate.find('#previewImageAvatarUpdate');
    let inputAvatarUpdate = containerModalUpdate.find('#imageAvatarUpdate');
    let previewGalleryUpdate = containerModalUpdate.find('#previewGalleryUpdate');
    let inputGalleryUpdate = containerModalUpdate.find('#inputGalleryUpdate');
    let selectionTypeUpdate = containerModalUpdate.find('#selectionTypeUpdate');
    let selectionMaterialUpdate = containerModalUpdate.find('#materialUpdate');
    let listMaterialUpdate = containerModalUpdate.find('#listMaterialUpdate');
    let checkboxPayBeforeUpdate = containerModalUpdate.find('#checkboxPayBeforeUpdate');
    let checkboxPayAfterUpdate = containerModalUpdate.find('#checkboxPayAfterUpdate');
    let checkboxNormalTranspotUpdate = containerModalUpdate.find('#checkboxRegularTranspotUpdate');
    let checkboxRegisterTranspotUpdate = containerModalUpdate.find('#checkboxRegisterTranspotUpdate');
    let checkboxEmsTranspotUpdate = containerModalUpdate.find('#checkboxEmsTranspotUpdate');
    let statusUpdateSelection = containerModalUpdate.find('#selectionStatusUpdate');
    let statusDetailUpdate = containerModalUpdate.find('#statusDetailUpdate');
    let amountUpdate = containerModalUpdate.find('#amountUpdate');
    let informationUpdate = containerModalUpdate.find('#inforamtionUpdate');
    let btnSaveUpdate = containerModalUpdate.find('#btnSaveUpdateProduct');

    //Source Original html image Preview Update
    let htmlPreviewAvatarUpdate = '';
    let htmlPreviewGalleryUpdate = '';    
    
    
    //Update Event
    btnCloseUpdate.click(()=>{
        //reset checkbox update     
        checkboxPayBeforeUpdate.prop('checked',false);
        checkboxPayAfterUpdate.prop('checked',false);    
        checkboxNormalTranspotUpdate.prop('checked',false);
        checkboxRegisterTranspotUpdate.prop('checked',false);   
        checkboxEmsTranspotUpdate.prop('checked',false);
      
        containerModalUpdate.toggleClass('d-none'); //close modal Update

    });
    selectionMaterialUpdate.on('click','button',addItemTolistMaterialUpdate);
    listMaterialUpdate.on('click','div>button',deleteMaterialItemUpdate);
    inputAvatarUpdate.change(function(){
        previewImgAvatarUpdate(this);
    });
    inputGalleryUpdate.change(function(){
        previewImgGalleryUpdate(this);
    });
    btnSaveUpdate.on('click',saveUpdate);

    //Delete DOM
    let modalDelete = container.find('#modalDeleteProduct');
    let btnCancelDelete = modalDelete.find('#btnCancelDeleteProduct');
    let btnSaveDelete = modalDelete.find('#btnSaveDeleteProduct');
    let idDelete = modalDelete.find('#idDeleteProduct');
    
    //Delete Event
    btnCancelDelete.click(()=>{
        modalDelete.toggleClass('d-none');
    })
    btnSaveDelete.on('click',saveDelete);

    //filer DOM
    let filterContainer = container.find('#productFilterContainer');
    let selectTypeFilter = filterContainer.find('#selectTypeFilter');
    let inputMinPriceFilter = filterContainer.find('#inputMinPriceFilter');
    let inputMaxPriceFilter = filterContainer.find('#inputMaxPriceFilter');
    let checkBoxAllMaterialFilter = filterContainer.find('#checkboxAllMaterialFilter');
    let listCheckboxMaterialFilter = filterContainer.find('#listCheckboxMaterial');
    let selectPaymentFilter = filterContainer.find('#selectPaymentFilter');
    let selectTranspotFilter = filterContainer.find('#selectTranspotFilter');
    let selectStatusFilter = filterContainer.find('#selectStatusFilter');
    let inputSearchNameFilter = filterContainer.find('#inputSearchNameFilter');
    let btnResetFilter = filterContainer.find('#btnResetFilter');
    let btnSaveFilter = filterContainer.find('#btnSaveFilter');
    //filter Event
    listCheckboxMaterialFilter.on('click','div>input',toggleCheckboxMaterialFilter);
    checkBoxAllMaterialFilter.click(checkListMaterialNull);
    btnResetFilter.click(resetFilter);
    btnSaveFilter.click(saveFilter);

    //Pagination DOM
    let paginationContainer = $('#paginationContainer');
    let tabPagination = paginationContainer.find('#paginationTab');
    let checkFirstPagination = true;
    let backUpFilter ='';
    tabPagination.on('click','li',setLinkPage);

    //Amount Product DOM
    let amountProduct = container.find('#amountProduct>span');

    function setLinkPage(event){
        // $(event.target) == span
        let target = $(event.target).parent(); // parent for go up to li
        let link = target.attr('data-link');
        let filterSecondary = undefined;
        if(backUpFilter){
            filterSecondary  = backUpFilter;
        }
        if(link){
            if(link == 'pre' || link == 'next'){
                let position = Number(tabPagination.find('li.active').attr('data-link'));
                
                console.log(position);
                
                if(link == 'pre'){
                    console.log('previos <');
                    fetchList(filterSecondary,position-1);  
                   
                }else{
                    console.log('Next >');
                    fetchList(filterSecondary,position+1);  
                }
            }else{
                console.log('number-link');
                console.log(link);       
                if(!target.hasClass('active')){
                   
                    
                    fetchList(filterSecondary,Number(link));   

                    tabPagination.find('li').removeClass('active');
                    target.addClass('active');
                }                   
                               
            }
        }


        
    }

    

    function saveFilter(){
        let filter = {};
        if(selectTypeFilter.val()!= '0'){           
            filter.type = selectTypeFilter.val();
        }

        if(checkBoxAllMaterialFilter.prop('checked') != true){
            let arrMaterial = [];   
            let childs = listCheckboxMaterialFilter.children();
            childs.each((index,value)=>{
                if($(value).find('input').prop('checked') == true){
                   let obj ={};
                   obj.id = $(value).attr('data-id');
                   obj.nameTh = $(value).attr('data-name-th');
                   obj.nameEn = $(value).attr('data-name-en');
                   arrMaterial.push(obj);
                }
            });
            if(arrMaterial.length > 0){
                filter.material = arrMaterial;
            }
        }

        if(inputMinPriceFilter.val() || inputMaxPriceFilter.val()){
                   
            let min = (inputMinPriceFilter.val() ? ((inputMinPriceFilter.val() < 0) ? 0 : Number(inputMinPriceFilter.val())) : 0);
            let max = (inputMaxPriceFilter.val() ? ((inputMaxPriceFilter.val() < 0) ? 0 : Number(inputMaxPriceFilter.val())) : 0);
            console.log(min,max);
            if(min > max){
                max = 0;
                inputMaxPriceFilter.val(0);
            }
            
            if(min !== 0 || max !== 0){
                filter.priceMin = min;
                filter.priceMax = max;
            }
        }

        if(selectPaymentFilter.val() != 0){
           let payment = selectPaymentFilter.val();
           if(payment == 1){
                filter.payment = {before:true};
               
           }else{
                filter.payment = {after:true};
           }
        }

        if(selectTranspotFilter.val() != 0){
            let delivery = selectTranspotFilter.val();
            if(delivery == 1){
                filter.delivery = {regular:true};
            }else if(delivery == 2){
                filter.delivery = {register:true};
            }else if(delivery == 3){
                filter.delivery = {ems:true};
            }
        }
        if(selectStatusFilter.val()!= 0){
            filter.status = selectStatusFilter.val();
        }

        if(inputSearchNameFilter.val()){
            filter.searchName = inputSearchNameFilter.val();
        }

        console.log(filter);
       
        fetchList(filter);
 
        // get length obj key filter
        // Object.keys(filter).length
    }

    function resetFilter(){
        selectTypeFilter.val('0');
        inputMinPriceFilter.val('');
        inputMaxPriceFilter.val('');
        checkBoxAllMaterialFilter.prop('checked',true);
        let childsofListMaterialChecbox = listCheckboxMaterialFilter.children();
        childsofListMaterialChecbox.each((index,value)=>{
           $(value).find('input').prop('checked',false) ;
       });
       selectPaymentFilter.val('0');
       selectTranspotFilter.val('0');
       selectStatusFilter.val('0');
       inputSearchNameFilter.val('');
    }

    function checkListMaterialNull(){
        if(checkBoxAllMaterialFilter.prop('checked') == true){
            let childsofListMaterialChecbox = listCheckboxMaterialFilter.children();
            childsofListMaterialChecbox.each((index,value)=>{
           $(value).find('input').prop('checked',false) ;
        });
        }else{
            let check = true;
            let childsofListMaterialChecbox = listCheckboxMaterialFilter.children();
            childsofListMaterialChecbox.each((index,value)=>{
                if($(value).find('input').prop('checked') == true){
                    check = false;
                }
               
            });
            if(check){
                checkBoxAllMaterialFilter.prop('checked',true);
            }
        }
    }

    function toggleCheckboxMaterialFilter(event){
        let check = false;
        let childs = listCheckboxMaterialFilter.children();

       childs.each((index,value)=>{
           if($(value).find('input').prop('checked') == true){
               check = true;      
           }
       });

       if(check){
            checkBoxAllMaterialFilter.prop('checked',false);
       }else{
            checkBoxAllMaterialFilter.prop('checked',true);
       }
        
    }
    
    
    function saveDelete(event){
        let id = idDelete.text();
        console.log(id);

        fetch(uri+id,{
            method:'DELETE'
        })
        .then((res)=>res.json())
        .then((result) =>{
            if(result.status == 200){
                modalDelete.toggleClass('d-none');
                container.append(`<div class="show-success-delete w-100 h-100 position-fixed" style="top:0; left:0; background-color:rgba(0, 0, 0, 0.43);">
                                    <div class="alert alert-success mx-5" role="alert" style="position: relative; top:50%; transform: translateY(-50%);">
                                        <h4 class="alert-heading">Delete Complete!</h4>
                                        <p>Delete Content in List of Products</p>
                                        <hr>   
                                        <p>${JSON.stringify(result.message)}</p>
                                    </div>
                                </div>`);
                    setTimeout(()=>{
                    container.find('.show-success-delete').remove();
                    },2000);   
                    fetchList();
            }else{
                modalDelete.toggleClass('d-none');
                container.append(`<div class="show-something-wrong w-100 h-100 position-fixed" style="top:0; left:0; background-color:rgba(0, 0, 0, 0.43);">
                                <div class="alert alert-danger mx-5" role="alert" style="position: relative; top:50%; transform: translateY(-50%);">
                                    <h4 class="alert-heading">Delete Invalid data!</h4>
                                    <p>Something Wrong Repeat Process Again</p>
                                    <hr>   
                                </div>
                            </div>`);
                setTimeout(()=>{
                container.find('.show-something-wrong').remove();
                },2000);   
            }
            
        });
        
    }


    function saveUpdate(){
    
    // nameUpdate
    // priceUpdate
    // inputAvatarUpdate
    // inputGalleryUpdate
    // selectionTypeUpdate
    // selectionMaterialUpdate
    // listMaterialUpdate
    // checkboxPayBeforeUpdate
    // checkboxPayAfterUpdate
    // checkboxNormalTranspotUpdate
    // checkboxRegisterTranspotUpdate
    // checkboxEmsTranspotUpdate
    // statusUpdateSelection
    // statusDetailUpdate
    // amountUpdate
    // informationUpdate


        let id =idUpdate.text();
        let nameProduct = nameUpdate.val();
        let priceProduct = priceUpdate.val();


        let imageAvatar = inputAvatarUpdate[0].files[0];  // console.log(imageAvatar.length);
        let imageGallery = inputGalleryUpdate[0].files; 
        
        let typeProduct = {};
            typeProduct.idType = selectionTypeUpdate.find(':selected').val();
            typeProduct.nameTh = selectionTypeUpdate.find(':selected').attr('data-name-th');
            typeProduct.nameEn = selectionTypeUpdate.find(':selected').attr('data-name-en');
       
        let materialProduct = [];      
            listMaterialUpdate.children().each((index,value)=>{
                let obj  ={};
                obj.nameTh = $(value).attr('data-name-th');
                obj.nameEn = $(value).attr('data-name-en');
                materialProduct.push(obj); 
            });

        let paymentProduct ={}
            paymentProduct.payOnBefore = checkboxPayBeforeUpdate.prop('checked');
            paymentProduct.payOnDelivery = checkboxPayAfterUpdate.prop('checked');
        
        let transpotProduct = {};
            transpotProduct.regular = checkboxNormalTranspotUpdate.prop('checked');
            transpotProduct.register = checkboxRegisterTranspotUpdate.prop('checked');
            transpotProduct.ems = checkboxEmsTranspotUpdate.prop('checked');
        


        let statusProduct = {};
            statusProduct.name = statusUpdateSelection.find(':selected').val();
            statusProduct.detail = statusDetailUpdate.val();
            
        let amountProduct = Number(amountUpdate.val());
       
        let informationProduct = informationUpdate.val();

        if(checkInput()){
            console.log('Check data Update Complete');

            // console.log(id);     
            // console.log(nameProduct);
            // console.log(priceProduct);

            // console.log(imageAvatar);
            // console.log(imageGallery);

            // console.log(typeProduct);
            // console.log(materialProduct);
            // console.log(paymentProduct);
            // console.log(transpotProduct);
            // console.log(statusProduct);
            // console.log(amountProduct);
            // console.log(informationProduct);

            let formData = new FormData();
            formData.append('nameProductUpdate',nameProduct);
            formData.append('priceProductUpdate',priceProduct);

            if(imageAvatar){
                formData.append('imageAvatar',imageAvatar);
            }
            
            if(imageGallery.length > 0){
                Object.entries(imageGallery).forEach(value=>{             
                    formData.append('imageGallery',value[1]);
                });
            }

            formData.append('typeProductUpdate',JSON.stringify(typeProduct));
            formData.append('materialProductUpdate',JSON.stringify(materialProduct));
            formData.append('paymentProductUpdate',JSON.stringify(paymentProduct));
            formData.append('deliveryProductUpdate',JSON.stringify(transpotProduct));
            formData.append('statusProductUpdate',JSON.stringify(statusProduct));
            formData.append('amountProductUpdate',amountProduct);
            formData.append('informationProductUpdate',informationProduct);


            fetch(uri+id,{
                method:'PATCH',
                body:formData
            })
            .then((res)=>res.json())
            .then((data)=>{
                if(data.status == 200){                  
                    if(data.result.nModified == 1){
                        fetchList();         
                    }
                    
                    inputAvatarUpdate.val('');
                    inputGalleryUpdate.val('');
                    containerModalUpdate.toggleClass('d-none'); 
                    container.append(`<div class="show-success-update w-100 h-100 position-fixed" style="top:0; left:0; background-color:rgba(0, 0, 0, 0.43);">
                                            <div class="alert alert-success mx-5" role="alert" style="position: relative; top:50%; transform: translateY(-50%);">
                                                <h4 class="alert-heading">Update Complete!</h4>
                                                <p>New Content Updated in List of Products</p>
                                                <hr>
                                            
                                            </div>
                                        </div>`);
                    setTimeout(()=>{
                        container.find('.show-success-update').remove();
                    },2000);   
                }
                
            });
            
        }
        

        function checkInput(){
            if((nameProduct) &&  
            (priceProduct) && 
            (typeProduct.idType && typeProduct.nameTh && typeProduct.nameEn) && 
            (materialProduct.length > 0) && 
            (paymentProduct.payOnBefore || paymentProduct.payOnDelivery) &&           
            (transpotProduct.regular || transpotProduct.register || transpotProduct.ems) &&
            (statusProduct.name) && 
            (amountProduct > 0) && 
            (informationProduct)
            ){
                return true;
            }else{

                if(!nameProduct){
                        addInvalidAlert('INVALID PRODUCT NAME !!!',nameUpdate);
                }else{
                        removeInvalidAlert(nameUpdate);
                }

                if(!priceProduct){
                    addInvalidAlert('INVALID PRODUCT PRICE !!!',priceUpdate);
                }else{
                    removeInvalidAlert(priceUpdate);
                }

                if(!typeProduct.idType || !typeProduct.nameTh || !typeProduct.nameEn){
                    addInvalidAlert('PLEASE SELECT TYPE OF PRODUCT !!!',selectionTypeUpdate);
                }else{
                    removeInvalidAlert(selectionTypeUpdate);
                }

                if( materialProduct.length < 1){
                    addInvalidAlert('INVALID MATERAIL PRODUCT !!!',selectionMaterialUpdate);
                }else{
                    removeInvalidAlert(selectionMaterialUpdate);
                }

                if(!paymentProduct.payOnBefore && !paymentProduct.payOnDelivery){
                    addInvalidAlert('INVALID CHECKBOX PAYMENT !!!',checkboxPayAfterUpdate,5);
                }else{
                    removeInvalidAlert(checkboxPayAfterUpdate,5);
                }

                if(!transpotProduct.regular && !transpotProduct.register && !transpotProduct.ems){
                    addInvalidAlert('INVALID CHECKBOX TRANSPOT !!!',checkboxRegisterTranspotUpdate,5);
                }else{
                    if(!paymentProduct.payOnBefore && !paymentProduct.payOnDelivery){
                        
                    }else{
                        removeInvalidAlert(checkboxRegisterTranspotUpdate,5);
                    } 
                }

                if(!statusProduct.name){
                    addInvalidAlert('INVALID STATUS !!!',statusUpdateSelection);
                }else{
                    removeInvalidAlert(statusUpdateSelection);
                }
  
                if(amountProduct < 1){
                    addInvalidAlert('INVALID AMOUNT PRODUCT !!!',amountUpdate);
                }else{
                    removeInvalidAlert(amountUpdate);
                }

                if(!informationProduct){
                    addInvalidAlert('INVALID INFORMATION PRODUCT !!!',informationUpdate);
                }else{
                    removeInvalidAlert(informationUpdate);
                }
                return false;
            }

            function addInvalidAlert(message,element,parent = 1){
                let target = $(element).parent();
                if(parent == 5){
                    target =  $(element).parent().parent().parent().parent().parent();
                }
                
                
                if(target.prev('div.badge').length == 0){
                    $(`<div class="badge badge-warning mb-1 p-2 px-4" role="alert"> ${message}</div>`)
                    .insertBefore(target); 
                }         
            }
            function removeInvalidAlert(element,parent = 1){
                let target = $(element).parent();
                if(parent == 5){
                    target =  $(element).parent().parent().parent().parent().parent();
                }
                
                target.prev('div.badge').remove();
            }
           
        }    

    }//Save update


    function previewImgGalleryUpdate(input){
        previewGalleryUpdate.html('');
        if(input.files.length > 0){
            if(input.files.length <= 8){   
                
                try{             
                    Object.entries(input.files).forEach(value=>{
                        
                        if(value[1].type != 'image/png' && value[1].type != 'image/jpeg'){
                            previewGalleryUpdate.html(`<div class="alert alert-danger mb-0 w-100" role="alert">Invalid files! <strong>Some file  Not an Image</strong></div>`);
                            setTimeout(()=>{
                                previewGalleryUpdate.html(htmlPreviewGalleryUpdate);
                            },2000);
                            inputGalleryUpdate.val('');
                            throw 'Error INVALID FILE';
                        }else{
                           
                            let reader = new FileReader(); 
                            reader.readAsDataURL(value[1]);
                            reader.onload = function(e){
                                previewGalleryUpdate.append(`<img class="col-3 p-1" src="${e.target.result}" alt="preview image gallery update" style="max-height:150px; object-fit: contain;">`);
                            }
                            
                        }
                    });
                 
                }catch(e){
                    console.log(e);
                }       
                
            }else{

                previewGalleryUpdate.html(`<div class="alert alert-danger mb-0 w-100" role="alert">Invalid files! <strong>limit 8 files image</strong></div>`);
                setTimeout(()=>{
                    previewGalleryUpdate.html(htmlPreviewGalleryUpdate);
                },2000);
                inputGalleryUpdate.val('');
            }
            
        }else{
            previewGalleryUpdate.html(htmlPreviewGalleryUpdate);
        }
    }

    function previewImgAvatarUpdate(input){
        
        if(input.files.length>0){
            let reader = new FileReader();
            console.log(input.files[0]);
            if(input.files[0].type == 'image/jpeg' || input.files[0].type == 'image/png'){
                //set read file from file selected
                reader.readAsDataURL(input.files[0]);
                //callback reader file when read data complete
                reader.onload = function(e){
                    previewAvatarUpdate.attr('src',e.target.result);
                }
            }else{
                
                containerPreviewAvatarUpdate.append(`<div class="alert alert-danger mb-0" role="alert">This File is <strong>not an Image!</strong></div>`);
                setTimeout(()=>{
                    containerPreviewAvatarUpdate.find('div.alert').remove();
                },2000);
                inputAvatarUpdate.val('');
            }
           
        }else{
            previewAvatarUpdate.attr('src',htmlPreviewAvatarUpdate);
            
        } 
    }

    function deleteMaterialItemUpdate(event){
        $(event.target).parents('.alert').remove();         
    }

    function addItemTolistMaterialUpdate(event){
        let target = $(event.target);

        let id = target.attr('data-id');
        let nameTh = target.attr('data-material-name-th');
        let nameEn = target.attr('data-material-name-en');
        let checkRepeat = true;
        
        // listMaterialUpload.children
        listMaterialUpdate.children().each((index,value)=>{
            
            let Elementinlist = $(value).attr('data-name-th');
            if(Elementinlist == nameTh){
                checkRepeat = false;
            }
            
        });

        if(checkRepeat){
            listMaterialUpdate.append(`<div class="alert btn-secondary p-1 mr-1 mb-1"
                    data-id="${id}" 
                    data-name-th="${nameTh}" 
                    data-name-en="${nameEn}"
                    >
                    <span class="mx-3 align-middle">${nameTh}(${nameEn})</span>
                    <button type="button" class="close pb-1" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`);
        }

        
    }
    function showModalDelete(event){
        let id = getIdProduct(event);
        console.log(id);

        if(id){
            idDelete.text(id);
            modalDelete.toggleClass('d-none');
        }      
    }
    function showModalUpdate(event){ //show modal when click btn update product
        let id = getIdProduct(event);
        console.log('Update '+id);
        loadTypeAndMaterial();
        fetch(uri+id)
        .then(res => res.json())
        .then(data =>{
            if(data.status == 200){
                setOriginalDatatoModalUpdate(data.data);
                containerModalUpdate.toggleClass('d-none');
            }else{
               console.log(data);      
            }
            
        });
        
    }
    function setOriginalDatatoModalUpdate(data){
        idUpdate.text(data._id)
        nameUpdate.val(data.name);
        priceUpdate.val(data.price);
        previewAvatarUpdate.attr('src',data.imageAvatar);
        
        let imgGallery = '';
        data.imageGallery.forEach(value=>{
            imgGallery += `<img class="col-3 p-1" src="${value}" alt="preview image gallery update"
            style="max-height:150px; object-fit: contain;">`;
        });
        previewGalleryUpdate.html(imgGallery);

        //backUp original templat image Preview
        htmlPreviewAvatarUpdate = previewAvatarUpdate.attr('src');
        htmlPreviewGalleryUpdate = previewGalleryUpdate.html();  
        

        selectionTypeUpdate.val(data.type.idType);
        // selectionMaterialUpdate
        let outputMaterial = '';
        data.material.forEach(value =>{
            outputMaterial += `<div class="alert btn-secondary p-1 mr-1 mb-1" data-id="" data-name-th="${value.nameTh}" data-name-en="${value.nameEn}">
                                    <span class="mx-3 align-middle">${value.nameTh}(${value.nameEn})</span>
                                    <button type="button" class="close pb-1" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>`;
        });
        listMaterialUpdate.html(outputMaterial);

        if(data.payment.payOnBefore){
            checkboxPayBeforeUpdate.prop('checked',true);
        }
        if(data.payment.payOnDelivery){
            checkboxPayAfterUpdate.prop('checked',true);
        }
  
        if(data.delivery.regular){
            checkboxNormalTranspotUpdate.prop('checked',true);
        }
        if(data.delivery.register){
            checkboxRegisterTranspotUpdate.prop('checked',true);
        }
        if(data.delivery.ems){
            checkboxEmsTranspotUpdate.prop('checked',true);
        }
       
        statusUpdateSelection.val(data.status.name);
        statusDetailUpdate.val(data.status.detail);
        amountUpdate.val(data.amount);
        informationUpdate.val(data.information);
    }

    function loadTypeAndMaterial(){
        selectionTypeUpdate.html(selectorTypeProduct.html());
        selectionMaterialUpdate.html(selectorMaterialProduct.html());
    }

    function setImageOnTopDetail(event){
        let target = $(event.target);
        let srcSelect = target.attr('src');
        imgAvatarDetail.attr('src',srcSelect);  
    }

    function showDetail(event){
        let id = getIdProduct(event);
        fetch(uri+id)
        .then((res)=>res.json())
        .then((data)=>{
            if (data.status == 200) {
                console.log(data);
                setDataToModalDetail(data.data);
                containerDetail.toggleClass('d-none');
                
            }else if(data.status == 404){
                console.log(data);     
            }
            
        });
        
    }
    function setDataToModalDetail(data){
       
        imgAvatarDetail.attr('src',data.imageAvatar);

        let htmlGallery = `<img class="h-100 mr-1" src="${data.imageAvatar}" style="cursor:pointer;"
        alt="">`;
        data.imageGallery.forEach(value=>{
            htmlGallery += `<img class="h-100 mr-1" src="${value}" style="cursor:pointer;"
            alt="">`;
        });
        listImgGalleyDetail.html(htmlGallery);

        if(data.status.detail == 0){
            statusDetail.html(data.status.name.toUpperCase());

        }else{
            statusDetail.html(data.status.name.toUpperCase()+"__"+data.status.detail);

        }
       
        nameDetail.text(data.name);

        idDetail.text(data._id);
        priceDetail.text(data.price);
        // typeDetail.text(data.type.nameTh+'('+data.type.nameEn+')');
        typeDetail.html(`<span class="alert alert-primary mr-1 mb-1 p-1 px-3" style="cursor: auto; border-radius: 1.5em;">${data.type.nameTh} (${data.type.nameEn})</span>`);

        let htmlMaterial = '';
        data.material.forEach(value=>{
            htmlMaterial += `<span class="btn btn-secondary mr-1 mb-1 p-1 px-3" style="cursor: auto; border-radius: 1.5em;">${value.nameTh}(${value.nameEn})</span>`;
        });
        materailDetail.html(htmlMaterial);

        let htmlPayment = '';
        let payOnBefore = data.payment.payOnBefore;
        let patOnAfter = data.payment.payOnDelivery;
        if(payOnBefore){
            htmlPayment+=`<span class="btn btn-info mr-1" style="cursor: auto; border-radius: 1.5em;">• ชำระก่อนสั่งซื้อ</span>`;
        }
        if(patOnAfter){
            htmlPayment+=`<span class="btn btn-info mr-1" style="cursor: auto; border-radius: 1.5em;">• ชำระเงินปลายทาง</span>`;
        }
        paymentDetail.html(htmlPayment);
       

        let htmlTranspot = '';
        let regularTranspot = data.delivery.regular;
        let registerTranspot = data.delivery.register;
        let emsTranspot = data.delivery.ems;
        if(regularTranspot){
            htmlTranspot+=`<span class="btn btn-success mr-1" style="cursor: auto; border-radius: 1.5em;">• ปกติ</span>`;
        }
        if(registerTranspot){
            htmlTranspot+=`<span class="btn btn-success mr-1" style="cursor: auto; border-radius: 1.5em;">• ลงทะเบียน</span>`;
        }
        if(emsTranspot){
            htmlTranspot+=`<span class="btn btn-success mr-1" style="cursor: auto; border-radius: 1.5em;">• Ems</span>`;
        }
        transpotDetail.html(htmlTranspot);

        informationDetail.text(data.information);
    }

    function getIdProduct(event){
        let target = $(event.target).parents('ul.list-group'); 
        let id = target.find('li.link-id-product').attr('data-id');
        return id;
    }


    function deleteMaterialItem(event){
       $(event.target).parent().parent().remove();
    }

    function saveUpload(){
   
        let nameProduct = inputProductName.val();
        let priceProduct = inputPriceProduct.val();
        let imageAvatar = inputImageAvatar[0].files[0];  // console.log(imageAvatar.length);
        let imageGallery = inputImageGallery[0].files; 
        
        
        let typeProduct = {};
            typeProduct.idType = selectorTypeProduct.find(':selected').val();
            typeProduct.nameTh = selectorTypeProduct.find(':selected').attr('data-name-th');
            typeProduct.nameEn = selectorTypeProduct.find(':selected').attr('data-name-en');
       

        let materialProduct = [];      
            listMaterialUpload.children().each((index,value)=>{
                let obj  ={};
                obj.nameTh = $(value).attr('data-name-th');
                obj.nameEn = $(value).attr('data-name-en');
                materialProduct.push(obj); 
            });

        let paymentProduct ={}
            paymentProduct.payOnBefore = payBeforeCheckBox.prop('checked');
            paymentProduct.payOnDelivery = payAfterCheckBox .prop('checked');
        
        let transpotProduct = {};
            transpotProduct.regular = normalTranspotCheckBox.prop('checked');
            transpotProduct.register = registerTranspotCheckBox.prop('checked');
            transpotProduct.ems = emsTranspotCheckBox.prop('checked');
        
        let statusProduct = {};
            statusProduct.name = selectorStatusProduct.find(':selected').val();
            statusProduct.detail = inputPercentProduct.val();
            
        let amountProduct = Number(inputAmountProduct.val());
       
        let informationProduct = inputInformationProduct.val();
        
      
        
       
        if(checkInput()){
            //post product
            console.log('CHeck input Upload Complete');
            // console.log(nameProduct);
            // console.log(priceProduct);
            // console.log(imageAvatar);
            // console.log(imageGallery);
            // console.log(typeProduct);
            // console.log(materialProduct);
            // console.log(paymentProduct);
            // console.log(transpotProduct);
            // console.log(statusProduct);
            // console.log(amountProduct);
            // console.log(informationProduct);

            let formData = new FormData();
            formData.append('nameProduct',nameProduct);
            formData.append('priceProduct',priceProduct);
            formData.append('imageAvatar',imageAvatar);

            Object.entries(imageGallery).forEach(value=>{             
                formData.append('imageGallery',value[1]);
                
            });
            
            formData.append('typeProduct',JSON.stringify(typeProduct));
            formData.append('materialProduct',JSON.stringify(materialProduct));
            formData.append('paymentProduct',JSON.stringify(paymentProduct));
            formData.append('deliveryProduct',JSON.stringify(transpotProduct));
            formData.append('statusProduct',JSON.stringify(statusProduct));
            formData.append('amountProduct',amountProduct);
            formData.append('informationProduct',informationProduct);
            fetch(uri,{
                method:'POST',
                body:formData
            })
            .then((res)=>{
                if(res.status == 500){
                    uploadContainer.append(`
                    <div class="alert-response-500 position-fixed fixed-top w-100 h-100" style="background-color: rgba(0, 0, 0, 0.43);">
                        <div class="alert alert-danger position-relative shadow-material-1 mx-auto w-75" style="position:relative; top:50%;  transform: translateY(-50%);">
                            <h4 class="alert-heading">Response status Error ${res.status}!</h4>
                            <p>${res.statusText}</p>
                            <hr>
                            <p class="mb-0">Invalid Sever Response.</p>
                        </div>
                    </div>`);

                    setTimeout(()=>{
                        uploadContainer.find('.alert-response-500').remove();
                    },2500);
                }

                return res.json();
            })
            .then((data) => {
                console.log(data);
                
                if(data.status == 200){
                    clearInputUpload();                
                    fetchList();
                    scrollToBottomPage();    
                    

                }else if(data.status == 400 ){
                    uploadContainer.append(`
                    <div class="alert-response-400 position-fixed fixed-top w-100 h-100" style="background-color: rgba(0, 0, 0, 0.43);">
                        <div class="alert alert-danger position-fixed shadow-material-1 mx-auto" style="position:relative; top:50%;  transform: translateY(-50%);">
                            <h4 class="alert-heading">Response status 400!</h4>
                            <p>Bad Request.</p>
                            <hr>
                            <p class="mb-0">Invalid Some Input.</p>
                        </div>
                    </div>`);

                    setTimeout(()=>{
                        uploadContainer.find('.alert-response-400').remove();
                    },2000);
                }
                
            });
                               
        }

        function checkInput(){
            if((nameProduct) &&  
            (priceProduct) && 
            (imageAvatar) && 
            (imageGallery.length > 0) &&
            (typeProduct.idType && typeProduct.nameTh && typeProduct.nameEn) && 
            (materialProduct.length > 0) && 
            (paymentProduct.payOnBefore || paymentProduct.payOnDelivery) &&           
            (transpotProduct.regular || transpotProduct.register || transpotProduct.ems) &&
            (statusProduct.name) && 
            (amountProduct > 0) && 
            (informationProduct)
            ){
                return true;
            }else{

                if(!nameProduct){
                        addInvalidAlert('INVALID PRODUCT NAME !!!',inputProductName);
                }else{
                        removeInvalidAlert(inputProductName);
                }

                if(!priceProduct){
                    addInvalidAlert('INVALID PRODUCT PRICE !!!',inputPriceProduct);
                }else{
                    removeInvalidAlert(inputPriceProduct);
                }

                if(!imageAvatar){
                    addInvalidAlert('PLEASE SELECT IMAGE OF AVATAR  !!!',inputImageAvatar);
                }else{
                    removeInvalidAlert(inputImageAvatar);
                }

                if(imageGallery.length < 1){
                    addInvalidAlert('PLEASE SELECT IMAGES OF GALLERY !!!',inputImageGallery);
                }else{
                    removeInvalidAlert(inputImageGallery);
                }

                if(!typeProduct.idType || !typeProduct.nameTh || !typeProduct.nameEn){
                    addInvalidAlert('PLEASE SELECT TYPE OF PRODUCT !!!',selectorTypeProduct);
                }else{
                    removeInvalidAlert(selectorTypeProduct);
                }

                if( materialProduct.length < 1){
                    addInvalidAlert('INVALID MATERAIL PRODUCT !!!',selectorMaterialProduct);
                }else{
                    removeInvalidAlert(selectorMaterialProduct);
                }

                if(!paymentProduct.payOnBefore && !paymentProduct.payOnDelivery){
                    addInvalidAlert('INVALID CHECKBOX PAYMENT !!!',payAfterCheckBox,5);
                }else{
                    removeInvalidAlert(payAfterCheckBox,5);
                }
                
                if(!transpotProduct.regular && !transpotProduct.register && !transpotProduct.ems){
                    addInvalidAlert('INVALID CHECKBOX TRANSPOT !!!',registerTranspotCheckBox,5);
                }else{
                    if(!paymentProduct.payOnBefore && !paymentProduct.payOnDelivery){
                        
                    }else{
                        removeInvalidAlert(registerTranspotCheckBox,5);
                    }
                   
                }

                if(!statusProduct.name){
                    addInvalidAlert('INVALID STATUS !!!',selectorStatusProduct);
                }else{
                    removeInvalidAlert(selectorStatusProduct);
                }
                
                if(amountProduct < 1){
                    addInvalidAlert('INVALID AMOUNT PRODUCT !!!',inputAmountProduct);
                }else{
                    removeInvalidAlert(inputAmountProduct);
                }

                if(!informationProduct){
                    addInvalidAlert('INVALID INFORMATION PRODUCT !!!',inputInformationProduct);
                }else{
                    removeInvalidAlert(inputInformationProduct);
                }
                return false;
            }

            function addInvalidAlert(message,element,parent = 1){
                let target = $(element).parent();
                if(parent == 5){
                    target =  $(element).parent().parent().parent().parent().parent();
                }
                
                
                if(target.prev('div.badge').length == 0){
                    $(`<div class="badge badge-warning mb-1 p-2 px-4" role="alert"> ${message}</div>`)
                    .insertBefore(target); 
                }         
            }
            function removeInvalidAlert(element,parent = 1){
                let target = $(element).parent();
                if(parent == 5){
                    target =  $(element).parent().parent().parent().parent().parent();
                }
                
                target.prev('div.badge').remove();
            }
           
        }          
    }


    function scrollToBottomPage(){
        let body = document.querySelector('body');
        let start = body.scrollTop; //position now
        let end = $(document).height(); // height of page

        loopScrollPage();
    
        function loopScrollPage(){
            if(start <= end){
                start +=30;
                window.scrollTo(0,start);
                setTimeout(loopScrollPage, 1);
            }
        }
    }

    function clearInputUpload(){
        inputProductName.val('');
        inputPriceProduct.val('');
        inputImageAvatar.val(''); 
        previewImageAvatarUpload.html(''); 
        inputImageGallery.val('');
        previewImageGalleyUpload.html(''); 
        selectorTypeProduct.val('0');  
        listMaterialUpload.html(''); 
        payBeforeCheckBox.prop('checked',false); 
        payAfterCheckBox.prop('checked',false);  
        normalTranspotCheckBox.prop('checked',false);  
        registerTranspotCheckBox.prop('checked',false);  
        emsTranspotCheckBox.prop('checked',false);  
        selectorStatusProduct.val('0'); 
        inputPercentProduct.val(0); 
        inputAmountProduct.val(0); 
        inputInformationProduct.val(''); 
    }

    function readFileGalleryToPreview(input){
        if(input.files.length > 0){ 
            previewImageGalleyUpload.html('');
            if(input.files.length <= 8){
                try{             
                    Object.entries(input.files).forEach((value)=>{
                        if(value[1].type != 'image/png' && value[1].type != 'image/jpeg'){
                            previewImageGalleyUpload.html(`<div class="alert alert-danger mb-0 w-100" role="alert">Some Input files is <strong>Not an Image!</strong></div>`);
                            inputImageGallery.val('');
                            throw 'Error : Some Input files  is Not an Image';
                        }else{
                            let reader = new FileReader();
                            reader.readAsDataURL(value[1]);
                            //callback read data
                            reader.onload = function(e){
                                previewImageGalleyUpload.append(`<img class="col-3 p-1" src="${e.target.result}" alt="preview image Gallery"
                                                            style="max-height:150px; object-fit: contain;">`);
                            }
                        }   
                    });
                    
               }catch(e){
                    console.log(e);    
               }
              
              
               
            }else{          
               previewImageGalleyUpload.html('<div class="alert alert-danger mb-0 w-100" role="alert">You can select <strong>Limit 8 files images!</strong></div>');
               inputImageGallery.val('');
            }
        
          
        
        }else{
            previewImageGalleyUpload.html('<em style="color:red;" class="notify-txt">Image Gallery Not found !</em>');
        }
     
    }

    function readFileAvatarToPreview(input){
        if(input.files.length > 0){
            //check image-type
            if(input.files[0].type == 'image/png' || input.files[0].type == 'image/jpeg'){
                let reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                //callback read data
                reader.onload = function(e){
                    previewImageAvatarUpload.html(`<img class="img-card-top d-block mx-auto" src="${e.target.result}" alt="preview image avatar"
                                                    style="max-width:100%; height:300px; object-fit: contain;">`);
                }

            }else{
                console.log('this file is not an image');
                previewImageAvatarUpload.html(`<div class="alert alert-danger mb-0" role="alert">This File is <strong>not an Image!</strong></div>`);
                inputImageAvatar.val('');
            }
            
        }else{
            previewImageAvatarUpload.html('<em style="color:red;" class="notify-txt">Image Avatar Not found !</em>');
        }    
    }

    function addMaterialtoList(event){
        let target = $(event.target);

        let id = target.attr('data-id');
        let nameTh = target.attr('data-material-name-th');
        let nameEn = target.attr('data-material-name-en');
        let checkRepeat = true;
        
        
        // listMaterialUpload.children
        listMaterialUpload.children().each((index,value)=>{
            
            let Elinlist = $(value).attr('data-id');
            if(Elinlist == id){
                checkRepeat = false;
            }
            
        });

        if(checkRepeat){
            listMaterialUpload.append(`<div class="alert btn-secondary p-1 mr-1 mb-1"
                    data-id="${id}" 
                    data-name-th="${nameTh}" 
                    data-name-en="${nameEn}"
                    >
                    <span class="mx-3 align-middle">${nameTh}(${nameEn})</span>
                    <button type="button" class="close pb-1" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`);
        }

    }

    function fetchMaterial(){
        let uri = '/material/'
        fetch(uri)
        .then(res=>res.json())
        .then(data =>{
            if(data.status == 200){
                let output = '';
                let ouputFilter = '';

                data.data.forEach((value)=>{
                    output += `<button data-id ="${value._id}" data-material-name-en= "${value.nameEn}"
                                 data-material-name-th= "${value.nameTh}" 
                                 type="button" 
                                 class="btn btn-light mb col rounded-0 border">${value.nameTh}(${value.nameEn})</button>`;
                    ouputFilter += ` <div class="form-check" data-name-th="${value.nameTh}" data-name-en="${value.nameEn}" data-id="${value._id}">
                                        <input class="form-check-input" type="checkbox">
                                        <label class="form-check-label text-truncate w-100">
                                            ${value.nameTh}(${value.nameEn})
                                        </label>
                                    </div>`;
                });
                selectorMaterialProduct.html(output);
                listCheckboxMaterialFilter.html(ouputFilter);
            }else{
                selectorMaterialProduct.html(data.data);
                listCheckboxMaterialFilter.html(data.data);
            }
        });
    }

    function getValueType(){
        // $(this) คือ selectorTypeProduct
        // console.log(selectorTypeProduct.find(':selected').val());
        // console.log(selectorTypeProduct.find(':selected').attr('data-name-th'));
        // console.log(selectorTypeProduct.find(':selected').attr('data-name-en'));      
    }

    function fetchType(){
        let uriType = '/menu/';
        fetch(uriType)
        .then((res)=>res.json())
        .then((data)=>{
            if(data.length > 0){
                let option = '<option selected value="0">Choose..</option>';
                let optionFilter = '<option selected value="0">ทั้งหมด</option>';
  
                data.forEach((value)=>{
                    value._id
                    value.nameTh
                    value.nameEn
                    option += `<option data-name-th="${value.nameTh}" data-name-en="${value.nameEn}" value="${value._id}">${value.nameTh}(${value.nameEn})</option>`;
                    optionFilter += `<option data-name-th="${value.nameTh}" data-name-en="${value.nameEn}" value="${value._id}">${value.nameTh}(${value.nameEn})</option>`;
                });
                selectorTypeProduct.html(option);
                selectTypeFilter.html(optionFilter);
            }else{
                selectorTypeProduct.html('<option selected>No Option selector!</option>');
                selectTypeFilter.html('<option selected>No Option selector!</option>');
            }
            
        });
    }

    function fetchList(filter = '' ,skip=0){
        let limits = 4;
        let active = 1;
        if(skip>=1){
            active = skip;
            skip = skip-1;
            skip = skip*limits;
            console.log('skip: '+skip);
            
        }
        let modified = {limits,skip};
        let dest = 'list?modified='+encodeURIComponent(JSON.stringify(modified));
        if(filter){
            backUpFilter = filter;
            filter.modified = modified;
            dest = 'filter?filter='+encodeURIComponent(JSON.stringify(filter));
        }
        fetch(uri+dest)
        .then((res)=> res.json())
        .then((data)=>{
            if(data.status == 200){
                // console.log(data.count); count of collection from server
                setPagination(data.count,limits,active);
                amountProduct.text(data.count);
                let output = '';
                data.data.forEach((value)=>{
                    output += `<div class="col-sm-6 col-md-4 col-lg-3 p-1 ">
                                    <ul class="list-group rounded-0">
                                        <li class="list-group-item p-0 link-detail" style="cursor: pointer; max-height:220px">
                                            <img class="w-100" src="${value.imageAvatar}"
                                                alt="" style="height:100%; max-width:100%; overflow-y:hidden;">
                                        </li>
                                        <li class="list-group-item text-truncate p-1 link-id-product" data-id="${value._id}">
                                           ID :  ${value._id}
                                        </li>
                                        <li class="list-group-item p-1 text-truncate">
                                            NAME : ${value.name}
                                        </li>
                                        <li class="list-group-item p-1">
                                         PRICE : ${value.price}
                                        </li>
                                        <li class="list-group-item p-1">
                                            ${value.type.nameTh}(${value.type.nameEn})
                                        </li>
                                        <li class="list-group-item d-flex p-0">
                                            <button class="btn btn-secondary rounded-0 col delete" type="submit">Delete</button>
                                            <button class="btn btn-primary w-100 rounded-0 update" type="submit">Update</button>
                                        </li>
                                    </ul>
                                </div>`;
                });

                list.html(output);
    
            }else{
                setPagination(data.count,limits,active);
                amountProduct.text(data.count);
                list.html(`<h5>${data.data}</h5>`);
            } 
        })
        .catch((err=>{
            console.log(err);   
        }))
    }

    function setPagination(count = 0,limits = 0,active = 1){
        let templatTabPage ='';
        console.log('Pagination count : '+count);
        console.log('Pagination Limit : '+limits);
        if(count >=  limits){
            if(count && limits){
                let countLink = count / limits;
                 countLink = Math.ceil(countLink);
                    if(countLink == 1){
                        tabPagination.html('');
                    }else{
                        templatTabPage +=`<li class="page-item page-previous" data-link="pre">
                                                <span class="page-link">Previous</span>
                                          </li>`
                        for(let i = 1 ;i<=countLink;i++){                        
                            templatTabPage +=`<li class="page-item" data-link="${i}">
                                                    <span class="page-link">${i}</span>
                                              </li>`;
                         }
                            templatTabPage += `<li class="page-item page-next" data-link="next">
                                                    <span class="page-link">Next</span>
                                             </li>`;

                        tabPagination.html(templatTabPage);              
                        tabPagination.find(`li[data-link = ${active}]`).addClass('active');
                        if(active == 1){
                            tabPagination.find('li.page-previous').addClass('disabled')
                        }else{
                            tabPagination.find('li.page-previous').removeClass('disabled');
                        }
                        if(active == countLink){
                            tabPagination.find('li.page-next').addClass('disabled');
                        }else{
                            tabPagination.find('li.page-next').removeClass('disabled');
                        }
            
                    }
    
            }else{
                tabPagination.html('');
            }         
        }else{
            tabPagination.html('');
        }
           
        console.log('Pagination count : '+count);
        console.log('Pagination Limit : '+limits);
        
    }
  
})();