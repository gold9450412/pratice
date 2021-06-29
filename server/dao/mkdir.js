//用來給files.js之類的 他們需要把文件儲存到目錄裡  使用這個js可以創建目錄
const fs = require('fs');
const path = require('path');

exports.mkdirs = function(pathname,callback){
	//使否為絕對路徑?
	pathname = path.isAbsolute(pathname)? pathname:path.join(__dirname,pathname);
	//轉成相對路徑
	pathname = path.relative(__dirname,pathname);
	let floders = pathname.split(path.sep); //解決平台差異的bug
	let pre="";
	floders.forEach(floders =>{
		try{
			let _stat = fs.statSync(path.join(__dirname,pre,floders));
			let hasMkdir = _stat && _stat.isDirectory();
			if(hasMkdir){
				callback;
			}
		} catch (error){
			try{
				fs.mkdirSync(path.join(__dirname,pre,floders));
				callback&&callback(null);
			}catch (error) {
				callback&&callback(error);
			}
		}
		pre=path.join(pre,floders);
	})
}