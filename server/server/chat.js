var dbserver = require('../dao/dbserver');

//獲取一對一聊天數據
exports.msg = function(req,res){
	let data = req.body;
	dbserver.msg(data,res);
}

exports.updateFriendMsg = function(req,res){
	let data = req.body;
	
	dbserver.updatefriendMsg(data,res);
}