var multer = require('multer');
var mkdir = require('../dao/mkdir');
var storage = multer.diskStorage({
	destination: function (req,file,cb){
		let url = req.body.url;
		mkdir.mkdirs('../data/'+url,err => {
			console.log(err);
		});
		cb(null , './data/'+url);
	},

	filename: function(req,file,cb){
		let name = req.body.name;
		let type = file.originalname.replace(/.+\./,".");
		console.log(type);
		cb(null, name+type);
	}
});

var upload = multer({storage:storage});

module.exports = function(app){
	//前端文件上傳
	app.post('/files/upload',upload.array('file',10),function(req,res,next){
		//路徑
		let url = req.body.url;
		//獲取文件訊息 
		//let data = req.files[0].path;
		let name = req.files[0].filename;
		let imgurl = '/'+url+'/'+name;
		//返回給前端
		res.send(imgurl);
	});
}