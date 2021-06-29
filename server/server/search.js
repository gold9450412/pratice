var dbserver = require('../dao/dbserver');

//搜尋用戶
exports.searchUser = function(req,res){
	let data = req.body.data;
	dbserver.searchUser(data,res);
}

//判斷是否為好友
exports.isFriend =	function(req,res){
	let uid = req.body.uid;
	let fid = req.body.fid;
	dbserver.isFriend(uid,fid,res);
}

//用戶群組
exports.searchGroup =	function(req,res){
	let uid = req.body.uid;
	let fid = req.body.fid;

	dbserver.searchGroup(uid,fid,res);
}

//是否在群組內
exports.isInGroup =	function(req,res){
	let uid = req.body.uid;
	let fid = req.body.fid;

	dbserver.isInGroup(uid,fid,res);
}