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
                        <p class="card-text m-0 name-th">${element.nameTh}</p>
                        <P class="card-text m-0 name-en">${element.nameEn}</P>
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
    let inputCodeLink = container.find('#inputCodeLinkSlideShow');
    let inputFileImage = container.find('#inputImageSlideshow');
    let previewImageUpload = container.find('#previewUploadSlideshow');
    let btnSaveUpload = container.find('#btnSaveUploadSlideshow');
    let notifyCode = container.find('.notify-txt');
    let notifyImage = container.find('.notify-img');


    //check input file image or not and show preview image select
    inputFileImage.change(function(){
        readUrlFile(this);//this == input files
    });

    btnSaveUpload.on('click',saveUpload);

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
 
                let formData = new FormData();
                formData.append("codeLink",inputCodeLink.val());
                formData.append("fileImage", inputFileImage[0].files[0]); //!!!


                fetch(uri,{
                    method:'POST',
                    body:formData})
                 .then((res)=>res.json())
                 .then((data)=>{
                    console.log(data);               
                 })
                 .catch((err)=>alert(err));

                
            }else{
                notifyImage.html('โปรดเลือกรูปภาพ');
            }

        }else{
            notifyCode.html('โปรดใส่โค้ดลิงค์สินค้าในภาพด้วย!');
        }  
    }
})();