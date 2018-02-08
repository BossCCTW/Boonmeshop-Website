    window.onload = function(){
        var buttonSendRegister = document.getElementById('btSendRegis');
        buttonSendRegister.onclick = function(){
            
        };
    }


    function sendData(){
        //get element input[text]
        let uid = document.getElementById('inputUid').value;
        let upw = document.getElementById('inputUpw').value;
    
        //get element input[select]
        let selectCareer = document.getElementById('selectCareer');
        let userCareer = selectCareer.options[selectCareer.selectedIndex].value; // หรือ .text [string ที่แสดงจริงใน html] 
    
        //get element input[radio]
        let radioGender = document.getElementById('gender1').checked;
        //return true หากมีการ check หรือ false หากไม่ได้ check
    
        //get element input[checkbox]
        let checkboxAcept = document.getElementById('ipCheckboxAccept').checked;
        //return true หากมีการ check หรือ false หากไม่ได้ check  
    
        // sendAjaxGet('http://localhost:2000/sendDataRegis',uid,upw);
        sendAjaxPost('http://localhost:2000/register/userdata',uid,upw);
    }
    
    
    
    
    function sendAjaxGet(url,username,password){
        var xhr = new XMLHttpRequest();
        //ตัวอย่างการส่งข้อมูล แบบ GET โดยส่ง json ไปด้วย ให้นำข้อมูลไปต่อท้าย url
        var url =url+encodeURIComponent(JSON.stringify({"username":username,"password":password}));

        //ตัวอย่างการส่งข้อมูล parameter ธรรมดา โดยนำข้อมูลไปต่อถ้าย url หากมีมากกว่า 1 ให้คั่นด้วย %
        // var urlData =url+username+'%'+password;

        xhr.open("GET",url,true);
        xhr.setRequestHeader("Content-type","application/json");
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                console.log(xhr.responseText+"data from server"); // ข้อมูลส่งกลับมาจาก server 
            }
        };
        xhr.send();//สำคัญอย่างลืมใช้คำสั่ง send!!!
    }
    function sendAjaxPost(url,id,pwd){
        var http = new XMLHttpRequest();
       //var data = 'userid='+id+'&'+'userpw='+pwd; //ส่งข้อมูลปกติ ใช้ form [ชื่อตัวแปล=ข้อมูล]คั่นด้วย & หากมีการส่งหลายตัวแปรต่อ 1 ครั้ง
         var data = JSON.stringify({"username":id,"password":pwd}); //สร้าง object แล้วแปลงเป็น json
        http.open("POST",url,true);
      //http.setRequestHeader("Content-type","application/x-www-form-urlencoded"); //header จะถูกกำหนดตามข้อมูลที่ส่ง text json และ อื่นๆ
        http.setRequestHeader("Content-type","application/json");// Header JSON
        http.onreadystatechange = function(){
            if(http.readyState === 4 && http.status === 200){
                console.log(http.responseText+"data from server");         
            }
        };
        http.send(data);
    }

