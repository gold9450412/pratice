var dbserver = require('../dao/dbserver');

exports.createGroup = function(req,res){
	let data = req.body;
	dbserver.createGroup(data,res);
}

exports.updateGroupMsg = function (req,res) {
	let data = req.body;
	dbserver.updateGroupMsg(data,res);
}