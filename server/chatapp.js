var bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const express = require('express');
var jwt = require('./dao/jwt');
const app = express()
const port =3002

//socket.io
var server =  app.listen(8082);
var io= require('socket.io').listen(server);
require('./dao/socket')(io);//傳入io到socket.js



/*
sendEmail({
  subject: "Test",
  text: "I am sending an email from nodemailer!",
  to: "gold9450412@gmail.com",
  from: process.env.EMAIL
});*/

app.get('/',(req,res)=>res.send(`Hello World`))


//跨域: app和後端溝通時，有跨域問題，server不可能接受所有陌生的請求
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
   else  next();
});



//解析前端數據  限制大小為50mb(避免上傳過大的文件或圖檔)
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

//獲取靜態路徑 可以讀到server的圖片(放在data裡)
app.use(express.static(__dirname+'/data'));


//token判斷  ps:放在chatapp是為了讓全頁面 每次載入 都要在驗證一次token是否過期
//**重要: 必須放在路由之前 不然這項會被無視 直到錯誤發生
app.use(function(req,res,next){
	
	if(req.body.token != undefined){//判斷前端是否帶來token
		let token =req.body.token;
		let tokenMatch = jwt.verifyToken(token);
		if(tokenMatch == 1){ //通過驗證
			next();
		}
		else{
			console.log(req.body.token);
			res.send({status:300}); //驗證不通過
		}
	}else{

		next(); //不帶token 直接跳過
	}
});

require('./router/index')(app);
require('./router/files')(app);
//404
app.use(function(req,res,next){
	let err = new Error('Not found')
	err.status = 404;
	next(err);
})

//500
app.use(function(err,req,res,next){
	res.status(err.status||500)
	res.send(err.message)
})


app.listen(port,()=>console.log(`Example app listening on port ${port}!`))
/*
require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
console.log("安安"+ process.env.EMAIL);
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail.com",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

sendEmail({
  subject: "Test",
  text: "I am sending an email from nodemailer!",
  to:  process.env.EMAIL,
  from: process.env.EMAIL
});*/