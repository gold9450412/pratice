var dbserver = require('../dao/dbserver');

//用戶詳情
exports.userDetail = function(req,res){
	let id = req.body.id;
	dbserver.userDetail(id,res);
}

//詳情修改
exports.userUpdate = function(req,res){
	let data = req.body;
	dbserver.userUpdate(data,res);
}

//獲取好友暱稱
exports.getMarkName = function(req,res){
	let data = req.body;
	dbserver.getMarkName(data,res);
}

//修改好友暱稱
exports.updateMarkName = function(req,res){
	let data = req.body;
	dbserver.updateMarkName(data,res);
}
