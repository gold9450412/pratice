var dbserver = require('../dao/dbserver');

var jwt = require('../dao/jwt');
//登入
exports.signIn = function(req,res){
	let data = req.body.data;
	let pwd = req.body.pwd;

	dbserver.userMatch(data,pwd,res);

}

exports.test =function(req,res){

	let token =req.body.token;
	let x = jwt.verifyToken(token);
	console.log(x);
	res.send({x});
}