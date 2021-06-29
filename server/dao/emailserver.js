//引用發送email插件
var nodemailer = require('nodemailer');
var credentials = require('../config/credentials')
 
 
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
 
	auth:{
		user:credentials.gm.user,
		pass:credentials.gm.pass,
	}
});

//註冊信箱 發給用戶
exports.emailSignUp = function(email,res){
	
	let options = {
		from: 'gold9450412@gmail.com',
		to: email,
		subject : '感謝您的註冊!',
		html : '<span>歡迎您的加入!</span><a href="http://localhost:8080/">點擊</a>'	,
	};

	transporter.sendMail(options,function(err,msg){
		if(err){
			//res.send("發送失敗");
			console.log(err);
			console.log("發送失敗"+credentials.gm.user);
		}else{
		//	res.send("發送成功");
			console.log('信件發送成功!');

		}
	})

};
/*
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require('dotenv').config();
const OAuth2 = google.auth.OAuth2;

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
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
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

//emailOptions - who sends what to whom
const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  let options = {
		from: process.env.EMAIL,
		to: process.env.EMAIL,
		subject : '感謝您的註冊!',
		html : '<span>歡迎您的加入!</span><a herf="http://localhost:8080/">點擊</a>'	,
	};
  //await emailTransporter.sendMail(emailOptions);

  await	emailTransporter.sendMail(options,function(err,msg){
		if(err){
			//res.send("發送失敗");
			console.log(err);
			console.log("發送失敗"+process.env.EMAIL);
		}else{
		//	res.send("發送成功");
			console.log('信件發送成功!');

		}
	})
};
*/

