var mongoose= require('mongoose');
//var db = mongoose.createConnection('mongodb://localhost:27017/local');
var db = mongoose.createConnection('mongodb://localhost:27017/study', {useNewUrlParser:true ,useUnifiedTopology:true,useFindAndModify:false });
db.on('error',console.error.bind(console,'連接失敗'));
db.once('open',function(){
	console.log('test資料庫打開成功')
});

module.exports = db; 