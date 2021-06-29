var dbserver = require('../dao/dbserver');
var email = require('../dao/emailserver');
exports.signUp = function(req,res){
	let name=req.body.name;
	let mail=req.body.mail;
	let pwd =req.body.pwd;
	//res.send({name,mail,pwd});
	email.emailSignUp(mail);
	dbserver.buildUser(name,mail,pwd,res);
};

//用戶或信箱占用判斷
exports.judgeValue = function(req,res){ //req為post 前端丟過來的資料 請求處的
	let data =req.body.data; //獲取前端資料
	let type =req.body.type; //獲取前端type
	console.log(data+" "+type);
	dbserver.countUserValue(data,type,res);
	//res.send({data,type});
}