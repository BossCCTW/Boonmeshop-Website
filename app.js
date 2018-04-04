var express = require('express');
var app = express();

const fileSystem = require('fs');
const pathSlideShow = __dirname + '/assets/imgs/slideshow';

const bodyParser = require('body-parser');
app.use(bodyParser()); //สั้งให้ bodyParser ทำงาน

//set ให้ express รู้จักไฟล์ต่างๆภายนอก เมื่อมีการลิงค์ไฟล์ css image icon
app.use('/assets', express.static(__dirname + '/assets/'));
app.use('/scripts', express.static(__dirname + '/scripts/'));


//เมื่อมีการเรียก url ที่ขึ้นต้นด้วย /api จะเข้าไปใช้งานไฟล์นี้
app.use('/api',require(__dirname+'/scripts/api.js'));


//send file html INDEX-PAGE
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
//send file html REGISTER-PAGE
app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/register.html');
});

//send file html ADMIN
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.get('/person', function (req, res) {
    res.sendFile(__dirname + '/person.html');
});

app.get('/slideShow', (req, res) => {
    fileSystem.readdir(pathSlideShow, (err, files) => {
        // files.forEach(file =>{  
        // });
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(files));
    });
});



app.listen(2000, function () {
    console.log("Boonme Web Server is running...");
});





//เรียกใช้งาน Module Body parser เพื่อทำการรับ req ที่มีการ POST เข้ามา
// var bodyParser = require('body-parser');
// app.use(bodyParser()); //สั้งให้ bodyParser ทำงาน
// //data test
// var userData = {
//     userid:'chanin',
//     password:'1234',
//     username:'BossCCTW',
//     usergrade:'5',
//     urlpic:'https://i.pinimg.com/564x/63/97/bc/6397bc38b3fb683880aac2559e33c56f.jpg'
//     };
// //!!!ข้อควรระวังเมื่อมีการ request เป็น get หรือ post ต้องสั่งให้ app.get หรือ app.post
// app.post('/userlogin',function(req,res){
//     //ตรวจสอบหาก req ไม่มีค่าที่ส่งมา จะส่ง สถานนะ 400 กลับไป
//     if(!req.body){
//         res.sendStatus(400); // Bad request
//         //res.sendStatus(404)
//     }
//     //เข้าถึง parameter ที่ส่งมาจะ POST ฝั่ง Ajax ด้วย req.body.parametername <== parametername = ตามชื่อของตัวแปลที่ตั้งไว้ในฝั่ง ajax 
//     //เช่น ส่ง 'username='+parameter; 
//     let id = req.body.username;//รับค่า id
//     let pw = req.body.password;//รับค่า pw
//     if(id == userData.userid && pw == userData.password){ //ตรวจว่า id และ pw ถูกหรือไม่
//         let userdataJSON = JSON.stringify( //ข้อมูลถูกต้อง ทำการสร้าง json จาก object โดยใช้ข้อมูลผูู้ใช้ส่งกลับไป
//             {
//             "status":"200",
//             "username":userData.username,
//             "member":userData.usergrade,
//             "userpic":userData.urlpic
//             }
//             );
//         res.send(userdataJSON);
//     }else{
//         let dataJSON =JSON.stringify( //หากข้อมูลไม่ตรง ทำการสร้าง สถานะบอกว่า ไม่พบข้อมูล
//             {
//             "status":"400"
//             }
//             );
//         res.send(dataJSON);
//         console.log(userData.userid,userData.password);

//     }
// });



//ตัวอย่างการรับส่งข้อมูลจากฝั่ง ajax ด้วย GET โดยมีตัวแปรส่งมาด้วย url ของฝั่ง nodejs จะเป็นลักษณะ /url:data หรือ /url/:data ก็ได้
//ฝั่ง ajax จะส่งมาแบบ 'http:/localhost:2000/sendDataRegis'+parameter
// app.get('/sendDataRegis:data',function(req,res){
//     //หากฝั่ง ajax ส่งข้อมูลพารามิเตอร์ธรรมดามา ตัวรับจะเป็บแบบนี้ มากกว่า 1 ตัวจะมี % คั่น
//     //app.get('/sendDataRegis:data1%:data2'
//     // res.send(req.params.userid+" "+req.params.password); //การนำตัวแปรที่ส่งมาจาก ajax นำไปใช้แบบนี้

//     //ตัวอย่างเมื่อข้อมูลที่ส่งมาทาง get เป็นแบบ json ต้องทำการแปลง json เป็น oject ก่อน ถึงจะเข้าถึง key ภายใน json ได้
//      var dataParser = JSON.parse(req.params.data);
//      res.send(dataParser.username);

//     // var dataConvertJson = JSON.parse(req.params.data); //แปลง json ให้เป็น object
//     // res.send('You send '+dataConvertJson.username+" ?");
// });


//POST [TEXT DATA] AND [JSON]
// app.post('/register/userdata',function(req,res){
//     // let id = req.body.userid; //หากเป็นตัวแปรธรรมดาให้ใช้ req.body.[parametername] เพื่อเข้าถึงข้อมูล  
//     // let pwd = req.body.userpw; //req.body.[userpw] นั้นมาจาก ชื่อของตัวแปรในตอนส่งจาก ajax ฝั่งส่งจะส่งแบบนี้ [var data = 'userid='+id+'&'+'userpw='+pwd]
//     let data = req.body; //รับค่าทั้งหมดที่ส่งมา หากเป็น json ก็จะใช้การเข้าถึงข้อมูลด้วยการ 
//     //data.username หรือ data.password จะต้องทราบว่า key ของ object คืออะไร
//     // res.send(data.username+':'+data.password);

//     // let jsonData = JSON.stringify({'id':data.username,'password':data.password});//ทำข้อมูล oject แล้วแปลงเป็น json แล้วส่งกลับไป
//     res.send(data);

// });


//การใช้ express แบบ basic <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// ส่ง parameter มาทาง url และใช้ req.params.name เพื่อรับค่าไปใช้งาน หากต้องการส่งมาที่ละ 2 ค่า ขึ้นไป
// ให้ใช้ % คั่นระหว่าง parameter ไว้ เช่น /:param1%:param2
// ส่ง parameter มาทาง get ('/:params') <== ตอนที่ผู้ใช้เรียกผ่าน http ลิงค์ /data ที่จะส่งมาด้วย ==> ตอนรับมาใช้ ก็ req.params.params
// app.get('/:productname%:productid',function(req,res){
//     res.send(req.params.productname+" : "+req.params.productid);
//     //res.send('Hello world'); respon text
// });


//การใช้ express และ Middleware เพื่อตรวจสอบ req ที่ส่งมา <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// app.use('/user/:userid',function(req,res,next){
//     console.log('Request at : '+new Date(),+' '+req.url,req.method);
// });


//ตัวอย่างการรับค่าจาก ลิงค์ที่ส่ง parameter มา แล้ว การนำข้อมูลที่สร้างขึ้นแบบ json ส่งกลับไป <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// var userData = {name:"Boss",job:"Programer",skill:"Full stack developer"};
// app.get('/:username',function(req,res){
//     res.render('home',{username:req.params.username,userData:userData});
// });
//ฝั่งรับที่ html ==> <%=username%>  ถ้าหาจะแสดงข้อมูลภายใน json ที่ส่งกลับมาให้ใช้ <%=userData.name%>


// ตัวอย่างการเรียกไฟล์ html จากการรีเควส และทำการตอบกลับไปด้วยไฟล์ html และการใช้ Form กรอกข้อมูล <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// app.get('/userlogin',function(req,res){
//     res.sendFile(__dirname+"/formlogin.html"); //res ไฟล์ html กลับไปเป็น form เพื่อให้ผู้ใช้กรอกข้อมูล (METHOD GET)
// });
// app.get('/userLogin',function(req,res){  //rout /userLogin มาจากชื่อ Action ของ Form เมื่อกด ปุ่ม submit จาก form browser ก็จะส่งมาที่ ลิงค์นี้
//     dataLogin = { //นำเอาข้อมูลจาก input มาเก็บไว้ในตัวแปล ด้วยการใช้คำสั่ง req.query.nameparameter ชื่อตัวแปลมาจากชื่อ name ของ input ใน form
//         id:req.query.username, //จะทำการเก็บข้อมูลแบบ object ซึ้งมี key:value
//         pw:req.query.password
//     }
//     console.log(dataLogin); //ทดสอบ log ข้อมูลที่ผู้ใช้กรอก
//     res.send(JSON.stringify(dataLogin)); //ส่งกลับไปหน้าเดินด้วยข้อมูลที่ผู้ใช้กรอกในแบบ json
// });


//ตัวอย่างการตรวจสอบ url ที่ผู้ใช้ส่งมาว่า ส่งมั่วหรือไม่ หรือเช็คว่าไม่มี url นี้อยู่ ให้ app.use  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// app.use(function(req,res,next){
//     res.status(404);
//     // if(req.accepts('html')){ 
//     //     res.render('home'); // ตัวอย่างการส่ง ไฟล์ html โดยใช้ ejs render เมื่อกรอก url มั่วมาจะให้กลับไปที่หน้า home
//     // }

//     if (req.accepts('html')) { //ส่งกลับไปเป็น html 404 ธรรมดา
//         res.send('404');
//         return;
//       }

//       // respond with json
//       if (req.accepts('json')) { // ส่งกลับแบบ json
//         res.send({ error: 'Not found' });
//         return;
//       }

//       // default to plain-text. send() 
//       res.type('txt').send('Not found'); //ส่งกลับแบบ text
// });


// ตัวอย่างการใช้งานการรับค่าจาก form ด้วย Method POST จะใช้  module body-parser ช่วยในการถอดรหัสค่าที่ส่งมา  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// var body = require('body-parser'); //เรียกใช้งาน
// app.use(body()); //สั่ง app user 

// app.get('/login',function(req,res){ //เมื่อกรอกลิงค์ login
//     res.sendFile(__dirname+'/formlogin.html'); //ส่งไฟล์ html ที่มี form กลับไป
// });

// app.post('/userlogin',function(req,res){ //ใช้ app.post เมื่อ form จาก html ใช้ method post  และใส่ rout ตามชื่อ action ของ form
//     datalogin = { //การเก็บข้อมูลที่ผู้ใช้กรอกเข้ามาแบบ ออบเจ็ก
//         id:req.body.username, //จะใช้ req.body.params เพราะ จะใช้ body-paser ช่วยถึงจะเห็นข้อมูลแบบ post
//         pw:req.body.password
//     }
//     res.send('<h1>'+datalogin.id+'</h1>'); //ตัวอย่างการส่งค่าในตัวแปล ออบเจ็กกลับไป
// });