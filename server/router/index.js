var dbserver = require('../dao/dbserver');
var emailserver = require('../dao/emailserver');
var signup = require('../server/signup');
var signin = require('../server/signin');
var search = require('../server/search');
var user = require('../server/userdetail');
var friend = require('../server/friend');
var index = require('../server/index');
var chat = require('../server/chat');
var group = require('../server/group');
module.exports = function(app){
	//這裡我就創造了一個test頁面   localhost:3002/test
	//app.get('/test',(req,res)=>res.send(`這裡是test頁面`));
	//這裡我就創造了一個hi頁面   localhost:3002/hi
	//app.get('/hi',(req,res)=>res.send(`這裡是hi頁面`));

	app.get('/test',(req,res)=>{
		dbserver.findUser(res);
	});
	//email測試
	app.post('/mail',(req,res)=>{ //req為post 前端丟過來的資料 請求處的
		let mail = req.body.email;
		emailserver.emailSignUp(mail,res);
		res.send(mail);
	});

	//token驗證
	/*app.post('/signin/test2',(req,res)=>{
		res.send('正確');
		//signin.test(req,res);
	});*/

	//註冊頁面
	app.post('/signup/add',(req,res)=>{ //req為post 前端丟過來的資料 請求處的
		//console.log('aaer');
		signup.signUp(req,res);
	});

	//註冊時檢查占用判斷
	app.post('/signup/judge',(req,res)=>{ //req為post 前端丟過來的資料 請求處的
		signup.judgeValue(req,res);
	});

	//登入頁面
	app.post('/signin/match',(req,res)=>{
		signin.signIn(req,res);
	});

	//搜尋頁面
	//用戶搜尋
	app.post('/search/user',(req,res)=>{
		search.searchUser(req,res);
	});
	//判斷是否為好友
	app.post('/search/isfriend',(req,res)=>{
		search.isFriend(req,res);
	});

	//群組搜尋
	app.post('/search/group',(req,res)=>{
		search.searchGroup(req,res);
	});

	//判斷是否在好友
	app.post('/search/isingroup',(req,res)=>{
		search.isInGroup(req,res);
	});

 	//用戶詳情
 	//詳情
 	app.post('/user/detail',(req,res)=>{
		user.userDetail(req,res);
	});
 	//訊息修改
 	app.post('/user/update',(req,res)=>{
		user.userUpdate(req,res);
	});

	//好友暱稱修改
	app.post('/user/getmarkname',(req,res)=>{
		user.getMarkName(req,res);
	});


	//好友暱稱修改
	app.post('/user/updatemarkname',(req,res)=>{
		//user.friendMarkName(req,res);
		user.updateMarkName(req,res);
	});

	//好友操作
	//申請好友
	app.post('/friend/applyfriend',(req,res)=>{
		friend.applyFriend(req,res);
	});

	//好友狀態修改
	app.post('/friend/updatefriendstate',(req,res)=>{
		friend.updateFriendState(req,res);
	});

	//拒絕或刪除好友
	app.post('/friend/deletefriend',(req,res)=>{
		friend.deleteFriend(req,res);
	});
	
	//主頁
	//獲取好友列表
	app.post('/index/getfriend',(req,res)=>{
		index.getFriend(req,res);
		//index.doIt(req,res);
	});
	
	//獲取最後一條訊息
	app.post('/index/getlastmsg',(req,res)=>{
		index.getLastMsg(req,res);
	});

	//好友訊息未讀數
	app.post('/index/unreadmsg',(req,res)=>{
		index.unreadMsg(req,res);
	});

	//修改成已讀
	app.post('/index/updatemsg',(req,res)=>{
		index.updateMsg(req,res);
	});

	//獲取群組列表
	app.post('/index/getgroup',(req,res)=>{
		index.getGroup(req,res);
	});
	
	//獲取群組最後一條訊息
	app.post('/index/getlastgroupmsg',(req,res)=>{
		index.getLastGroupMsg(req,res);
	});

	//修改群組訊息為成已讀
	app.post('/index/updategroupmsg',(req,res)=>{
		index.updateGroupMsg(req,res);
	});

	//聊天頁面
	//獲取一對一聊天數據
	app.post('/chat/msg',(req,res)=>{
		chat.msg(req,res);
	});

	//建群組
	app.post('/group/creategroup',(req,res)=>{
		group.createGroup(req,res);
	});

	//更新1對1聊天紀錄已讀
	app.post('/chat/updatefriendmsg',(req,res)=>{
		chat.updateFriendMsg(req,res);
	})

	//更新群組聊天紀錄已讀
	app.post('/group/updategroupmsg',(req,res)=>{
		group.updateGroupMsg(req,res);
	})
}