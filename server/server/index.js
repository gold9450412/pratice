var dbserver = require('../dao/dbserver');

exports.getFriend = function(req,res){
	let data = req.body;
	if(data.state==0){
		dbserver.getUsers(data,res);
	}else if(data.state==1){
		dbserver.getUsers1(data,res);
	}
	
}

//獲取最後一條訊息
exports.getLastMsg = function(req,res){
	let data = req.body;
	dbserver.getOneMsg(data,res);
}

//好友未讀訊息數
exports.unreadMsg = function(req,res){
	let data=req.body;
	dbserver.unreadMsg(data,res);
}

//修改成已讀
exports.updateMsg = function(req,res){
	let data=req.body;
	dbserver.updateMsg(data,res);
}

//獲取群組列表
exports.getGroup = function(req,res){
	let uid = req.body.uid;
	dbserver.getGroup(uid,res);
}

//獲取最後一條訊息
exports.getLastGroupMsg = function(req,res){
	let gid = req.body.gid;
	dbserver.getOneGroupMsg(gid,res);
}

//修改群組訊息為成已讀
exports.updateGroupMsg = function(req,res){
	let data=req.body;
	dbserver.updateGroupMsg(data,res);
}
