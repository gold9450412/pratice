var mongoose = require('mongoose');
//引入資料庫
var db = require('../config/db');

var Schema = mongoose.Schema;

//用戶表
var UserSchema = new Schema({
	name: {type: String},						//用戶名字
	psw:  {type: String}, 						//密碼
	email: {type: String},						//信箱
	sex: {type: String, default: 'asexual'}, 	//性別
	birth: {type: Date},						//生日
	phone: {type: Number},						//電話
	explain: {type: String},					//介紹
	imgurl: {type: String,default:'/user/user.png'},	//頭像連結
	time: {type: Date},							//註冊時間
});

//好友表
var FriendSchema = new Schema({
	userID: {type: Schema.Types.ObjectId,ref:'User'},	//用戶ID
	friendID: {type: Schema.Types.ObjectId,ref:'User'}, //好友ID
	state: {type: String},								//通過狀態 0為好友 1為申請中 2為申請發送方
	time: {type: Date},									//生成時間
	markname:{type:String},								//好友暱稱
	lastTime:{type:Date}, 								//最後通訊時間
});

//一對一訊息表
var MessageSchema = new Schema({
	userID: {type: Schema.Types.ObjectId,ref:'User'},	//用戶ID
	friendID: {type: Schema.Types.ObjectId,ref:'User'}, //好友ID
	message: {type: String},							//訊息
	types: {type: String},								//訊息類型
	time: {type: Date},									//發送時間
	state: {type: Number},								//接收狀態 (0未讀 1已讀)
});

//群組表
var GroupSchema = new Schema({
	userID: {type: Schema.Types.ObjectId,ref:'User'},	//管理員ID
	name: {type: String},							 	//群組名稱
	imgurl: {type: String,default:'group.png'},			//群組頭像
	time: {type: Date},									//創建時間
	notice: {type: String},								//公告
});

//群組成員表
var GroupUserSchema = new Schema({
	groupID: {type: Schema.Types.ObjectId,ref:'Group'},	//群組ID
	userID: {type: Schema.Types.ObjectId,ref:'User'},	//用戶ID
	name: {type: String},							 	//群組內的名稱
	tip: {type: Number,default:0},						//未讀消息數
	time: {type: Date},									//加入時間
	lastTime:{type:Date}, 								//最後通訊時間
	shield: {type: Number},								//是否屏蔽 (0不  1要)
});

//群組訊息表
var GroupMsgSchema = new Schema({
	groupID: {type: Schema.Types.ObjectId,ref:'Group'},	//群組ID
	userID: {type: Schema.Types.ObjectId,ref:'User'},	//用戶ID
	message: {type: String},							//訊息
	types: {type: String},								//訊息類型
	time: {type: Date},									//發送時間
});
module.exports = db.model('User',UserSchema);
module.exports = db.model('Friend',FriendSchema);
module.exports = db.model('Message',MessageSchema);
module.exports = db.model('Group',GroupSchema);
module.exports = db.model('GroupUser',GroupUserSchema);
module.exports = db.model('GroupMsg',GroupMsgSchema);