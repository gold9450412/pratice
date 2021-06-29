var bcrypt = require('../dao/bcrypt');
var dbmodel = require('../model/dbmodel');
var User= dbmodel.model('User');
var jwt = require('../dao/jwt');
var Friend = dbmodel.model('Friend');
var Group = dbmodel.model('Group');
var GroupUser = dbmodel.model('GroupUser');
var Message = dbmodel.model('Message');
var GroupMsg = dbmodel.model('GroupMsg');
exports.buildUser = function(name,mail,pwd,res){

	let password = bcrypt.encryption(pwd);

	let data = {
		name: name,
		email: mail,
		psw:  password,
		time: new Date(),
	};
	let user = new User(data);
	user.save(function(err,result){
		if(err){
			res.send({status:500});
		}else{

			res.send({status:200});
		}
	});
}

//匹配用戶表 (是否存在相同用戶名)
exports.countUserValue = function(data,type,res){
	let wherestr={};
	wherestr[type] = data; //wherestr = {'type':data};
	User.countDocuments(wherestr,function(err,result){
		if(err){
			res.send({status:500});
		}else{
			res.send({status:200,result}); //result為0或1  代表是否存在

		}
	})

}


//用戶驗證
exports.userMatch = function(data,pwd,res){
	let wherestr = {$or:[{'name':data},{'email':data}]}; //要搜尋什麼。 先匹配 有沒有相應的name和email
	let out = {'name':1, 'imgurl':1,'psw':1}//搜尋完畢後 要輸出哪些項 1代表要輸出 0反之
	User.find(wherestr,out,function(err,result){
		if(err){
			res.send({status:500});
		}else{
			if(result == ''){ //沒匹配到 也就是空的
				res.send({status:400});
			}
			result.map(function(e){ //map用法
				const pwdMatch = bcrypt.verification(pwd,e.psw);
				if(pwdMatch){
					let token = jwt.generateToken(e._id);
					let back = {
						id: e._id,
						name: e.name,
						imgurl: e.imgurl,
						token : token,
					}
					res.send({status:200,back});
				}else{
					res.send({status:400}); //密碼錯誤
				}
			})
		}

	})
}



//搜尋用戶
exports.searchUser = function(data,res){
	let wherestr;
	if(data == 'chatapp'){ //空為全搜尋
		wherestr ={};
	}else{
		wherestr = {$or:[{'name':{$regex:data}},{'email':{$regex:data}}]}; //{$regex:.. } 字串的模糊比對 所以不用完全符合
	}
	let out={
		'name':1,
		'email':1,
		'imgurl':1,
	}
	User.find(wherestr,out,function(err,result){
		if(err){
			res.send({status:500});
		}else {
			res.send({status:200,result});
		}
	});
}

//判斷是否為好友
exports.isFriend = function(uid,fid,res){
	let wherestr = {'userID': uid,'friendID': fid,'state':0};

	Friend.findOne(wherestr,function(err,result){ //findone和find差異性  
		if(err){
			res.send({status:500});
		}else{
			if(result){
				res.send({status:200});//是好友
			}else{
				res.send({status:400}); //不是好友
			}
		}
	})
}

//群組搜尋
exports.searchGroup = function(data,res){
	let wherestr;
	if(data == 'chatapp'){ //空為全搜尋
		wherestr ={};
	}else{
		wherestr = {$or:[{'name':{$regex:data}}]}; //{$regex:.. } 字串的模糊比對 所以不用完全符合
	}
	let out={
		'name':1,
		'imgurl':1,
	}
	Group.find(wherestr,out,function(err,result){
		if(err){
			res.send({status:500});
		}else {
			res.send({status:200,result});
		}
	});
}


//判斷是否在群組裡
exports.isInGroup = function(uid,gid,res){
	let wherestr = {'userID': uid,'friendID': gid};

	Friend.findOne(wherestr,function(err,result){ //findone和find差異性  
		if(err){
			res.send({status:500});
		}else{
			if(result){
				res.send({status:200});//在群組內
			}else{
				res.send({status:400}); //不在
			}
		}
	})
}

exports.userDetail = function(id,res){
	let wherestr ={'_id':id};
	let out = {'psw':0};
	User.findOne(wherestr,out,function(err,result){
		if(err){
			res.send({status:500});
		}else{
			res.send({status:200,result});
		}
	})
}

function update(data,update,res){
	User.findByIdAndUpdate(data,update,function(err,resu){
		if(err){
			res.send({status:500}); //失敗
		}else{
			res.send({status:200}); //成功
		}
	});	
}


//用戶資料修改
exports.userUpdate = function(data,res){
	let updatestr ={};

	if(data.pwd != undefined){
		//有密碼
		User.find({'_id':data.id},{'psw':1},function(err,result){
		if(err){
			res.send({status:500});
		}else{
			if(result == ''){ //沒匹配到 也就是空的
				res.send({status:400});
			}
			result.map(function(e){ //map用法
				const pwdMatch = bcrypt.verification(data.pwd,e.psw);
				if(pwdMatch){ //密碼驗證成功
					if(data.type == 'psw'){ //如果是修改密碼

						let password = bcrypt.encryption(data.data);
						updatestr[data.type] = password;
						update(data.id,updatestr,res);
					}else{
						//信箱匹配 確定是否重複 (沒有存在該信箱)
						updatestr[data.type] = data.data;
						User.countDocuments(updatestr,function(err,result){
							if(err){
								res.send({status:500});
							}else{
								//沒有匹配到(數量=0)  即可以修改
								if(result ==0){
									update(data.id,updatestr,res);
								}else{
								res.send({status:600});			
								}
							}
						});	

					}
 						 
				}else{
					res.send({status:400}); //密碼錯誤
				}
			})
		}

	})
	}else if(data.type== 'name'){
		//用戶名稱匹配 確定是否重複 (沒有存在該名稱)
		updatestr[data.type] = data.data;
		User.countDocuments(updatestr,function(err,result){
			if(err){
				res.send({status:500});
			}else{
				//沒有匹配到(數量=0)  即可以修改
				if(result ==0){
					update(data.id,updatestr,res);
				}else{
				res.send({status:300});			
				}
			}
		});	
	}
	else{
		updatestr[data.type] = data.data;
 		update(data.id,updatestr,res); 
	}
}

//獲取好友暱稱
exports.getMarkName = function(data,res){
	let wherestr={'userID':data.uid , 'friendID':data.fid};
	let out = {'markname':1}; //沒有markname時 默認輸出id
	Friend.findOne(wherestr,out,function(err,result){
		if(err){
			res.send({status:500}); //失敗
		}else{
			res.send({status:200,result}); //成功
		}
	})
}



//好友暱稱修改
exports.updateMarkName = function(data,res){
	let wherestr={'userID':data.uid , 'friendID':data.fid};
	let updatestr = {'markname':data.name};
	Friend.updateOne(wherestr,updatestr,function(err,result){
		if(err){
			res.send({status:500}); //失敗
		}else{
			res.send({status:200}); //成功
		}
	})
}


//好友操作
//添加好友表
exports.buildFriend = function(uid,fid,state,res){
	let data = {
		userID: uid,
		friendID: fid,
		state:  state,
		time: new Date(),
		lastTime : new Date(),
	};
	let friend = new Friend(data);
	friend.save(function(err,result){
		if(err){
			//res.send({status:500});
			console.log('申請好友出錯');
		}else{

			//res.send({status:200});
		}
	});
};

//好友最後通訊時間
exports.upFriendLastTime = function(data){
	let wherestr = {$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]};
	let updatestr = {'lastTime':new Date()};

	Friend.updateMany(wherestr,updatestr,function(err,result){
		if(err){
			//res.send({status:500});  //這裡用console反饋給後端，否則反饋給前端 整個申請好友的過程 會太多res的反饋
			console.log('更新好友最後通訊時間出錯');
		}else{

			//res.send({status:200});
		}
	});
};
//添加一對一訊息
exports.insertMsg = function(uid,fid,msg,type,res){
	/*
	用途:插入聊天訊息至資料庫 (fid有可能是好友 也有可能是群組)
	1.用message.save 將聊天訊息，插入至Messages的資料庫
	2.如果成功，使用GroupUser.countDocuments，去查找是否有此fid的群組 (如果有=>fid為好友  沒有=>fid為群組)，同時也能確定此uid在此群組內
	3.如果fid為群組，使用GroupUser.find，查找全部在此群組內的成員，並利用map輸出成員資料(ver)
	4.GroupUser.updateMany，將成員的tip+1後，更新回GroupUser資料庫
	*/
	let data = {
		userID: uid,		//用戶ID
		friendID: fid, 		//好友ID
		message: msg,		//訊息
		types: type,		//訊息類型
		time: new Date(),	//發送時間
		state: 0,			//0未讀
	};
	let message = new Message(data);
	message.save(function(err,result){
	if(err){
		if(res){
			res.send({status:500});
		}
	}else{
			let wherestr = {'userID':uid,'groupID':fid};
			GroupUser.countDocuments(wherestr,(err,result) =>{
				if(err){
					if(res){
						res.send({status:500});
					}
				}else if(result==0){
					if(res){
						res.send({status:200,result});
					}	
				}else{
					let query = GroupUser.find({});
					query.where({'groupID':fid});
					query.exec().then(function(e){
					let result = e.map(function(ver){
						let findstr = {'userID':ver.userID,'groupID':ver.groupID};
						let updatestr = {'tip': ver.tip+1};
						GroupUser.updateMany(findstr,updatestr,function(err,result){
							if(err){
									if(res){
										console.log('更新失敗');
									}							
							}else{
									if(res){
										console.log('更新成功');
									}	
								//res.send({status:200});
							}
						});						

					});	
						if(res){					
						res.send({status:200,result});
						}
					}).catch(function(err){ //沒查到東東
						if(res){
						res.send({status:500});
						}
					});	

				}

			});			
	}
});
 

};

//好友申請 
exports.applyFriend = function(data,res){
	//判斷是否已經申請過該用戶好友
	let wherestr = {'userID':data.uid,'friendID':data.fid};
	Friend.countDocuments(wherestr,(err,result) =>{
		if(err){
			res.send({status:500});
		}else{
			
			if(result == 0){//初次申請
				this.buildFriend(data.uid,data.fid,2); //申請(發送)方
				this.buildFriend(data.fid,data.uid,1); //對方
			}else{ //>0也就是曾經申請過  更新最後通訊時間即可
				this.upFriendLastTime(data); 
				
			}
			this.insertMsg(data.uid,data.fid,data.msg,0,res);//申請好友必定為訊息  所以type為0 
		}
	});
};

//更新好友狀態
exports.updateFriendState = function(data,res){
	let wherestr={$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]};
	Friend.updateMany(wherestr,{'state':0},function(err,result){
	if(err){
		res.send({status:500}); 
		//console.log('更新好友最後通訊時間出錯');
	}else{

		res.send({status:200});
	}
});
}

//拒絕或刪除好友
exports.deleteFriend = function(data,res){
	let wherestr={$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]};
	Friend.deleteMany(wherestr,function(err,result){
	if(err){
		res.send({status:500}); 
		//console.log('更新好友最後通訊時間出錯');
	}else{

		res.send({status:200});
	}
});
}
/*//獲取好友列表 (查詢常用 要懂)
exports.getUsers = function(data,res){  
	let query = Friend.find({});
	query.where({'userID':data.uid,'state':data.state}); //查詢條件
	query.populate('friendID'); //查找friendID 和關聯的USER對象
	query.sort({'lastTime':-1}); //根據lasttime進行排序 -1由大到小(倒敘)排列  最前面為最新的資料
	query.exec().then(function(e){
		let result = e.map(function(ver){
			return {
				id:ver.friendID._id, //friendID有關聯user表  所以可以查到他的id
				name:ver.friendID.name, //friendID有關聯user表  所以可以查到他的name
				markname:ver.markname,
				imgurl:ver.friendID.imgurl,
				lastTime:ver.lastTime,
				type: 0, //一對一標記
			};
		});
		res.send({status:200,result});
	}).catch(function(err){ //沒查到東東
		res.send({status:500});
	});

}*/

//獲取好友列表 (好友邀請用)
exports.getUsers1 = function(data,res){  
	return new Promise(function(resolve,reject){
	let query = Friend.find({});
	query.where({'userID':data.uid,'state':data.state}); //查詢條件
	query.populate('friendID'); //查找friendID 和關聯的USER對象
	query.sort({'lastTime':-1}); //根據lasttime進行排序 -1由大到小(倒敘)排列  最前面為最新的資料
	query.exec().then(function(e){
		let result = e.map(function(ver){
			return {
				id:ver.friendID._id, //friendID有關聯user表  所以可以查到他的id
				name:ver.friendID.name, //friendID有關聯user表  所以可以查到他的name
				markname:ver.markname,
				imgurl:ver.friendID.imgurl,
				lastTime:ver.lastTime,
				type: 0, //一對一標記
			};
		});
		resolve({status:200,result});
	}).catch(function(err){ //沒查到東東
		reject({status:500});
	});
}).then(function onFulfilled(value){
	res.send(value);
})
}


//獲取好友列表 (查詢常用 要懂)
function getUsers(data){  
	return new Promise(function(resolve,reject){
	let query = Friend.find({});
	query.where({'userID':data.uid,'state':data.state}); //查詢條件
	query.populate('friendID'); //查找friendID 和關聯的USER對象
	query.sort({'lastTime':-1}); //根據lasttime進行排序 -1由大到小(倒敘)排列  最前面為最新的資料
	query.exec().then(function(e){
		let result = e.map(function(ver){
			return {
				id:ver.friendID._id, //friendID有關聯user表  所以可以查到他的id
				name:ver.friendID.name, //friendID有關聯user表  所以可以查到他的name
				markname:ver.markname,
				imgurl:ver.friendID.imgurl,
				lastTime:ver.lastTime,
				type: 0, //一對一標記
			};
		});

		resolve(result);
	}).catch(function(err){ //沒查到東東
		reject({status:500});
	});
})
}
/*//取出通話紀錄的最後一條訊息 
exports.getOneMsg = function(data,res){
	let query = Message.findOne({});
	query.where({$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]}); //查詢條件
	//query.populate('friendID'); //查找friendID 和關聯的USER對象
	query.sort({'time':-1}); //根據lasttime進行排序 -1由大到小(倒敘)排列  最前面為最新的資料
	query.exec().then(function(ver){
	
		let result= {
			message:ver.message,
			time:ver.time,
			types:ver.types,
		};
		console.log(result);
		return(result);
		//res.send({status:200,result});
	}).catch(function(err){ //沒查到東東
		//res.send({status:500});
		console.log('獲取失敗');
	});
}*/

//取出通話紀錄的最後一條訊息 
function getOneMsg(uid,fid){
	return new Promise(function(resolve,reject){
		let query = Message.findOne({});
		query.where({$or:[{'userID':uid,'friendID':fid},{'userID':fid,'friendID':uid}]}); //查詢條件
		query.populate('userID'); //查找friendID 和關聯的USER對象
		query.sort({'time':-1}); //根據lasttime進行排序 -1由大到小(倒敘)排列  最前面為最新的資料
		query.exec().then(function(ver){
			let result= {
				msgUserName: ver.userID.name,
				message:ver.message,
				time:ver.time,
				types:ver.types,
			};

			resolve(result);
		}).catch(function(err){ //沒查到東東
			reject({status:500});
			
		});
	});
}
async function friendreqest(data,res){
	let result,err;
	[err,result]= await getOneMsg(data.uid,data.fid).then(data => [null,data]).catch(err =>[err,null]);
	if(err){
		res.send(err);
	}else{
		res.send({status:200,result});
	}
}
exports.getOneMsg = function(data,res){
	friendreqest(data,res);
}
/*
//一對一未讀
exports.unreadMsg = function(data,res) {
	let wherestr = {'userID':data.fid,'friendID':data.uid,'state':0}; //0未讀
	Message.countDocuments(wherestr,(err,result) =>{
		if(err){
			console.log('獲取失敗');//res.send({status:500});
		}else{
			console.log(result);
			return(result);
 			//res.send({status:200,result});
		}
	});
}*/
//一對一未讀
function unreadMsg(uid,fid) {
	return new Promise(function(resolve,reject){
		let wherestr = {'userID':fid,'friendID':uid,'state':0}; //0未讀
		Message.countDocuments(wherestr,(err,result) =>{
			if(err){
				reject({status:500});
			}else{
	 			resolve(result);
			}
		});
	});
}
async function doIt(data,res){
	let result,bb,cc,err;
	[err,result] = await getUsers(data).then(data=> [null,data]).catch(err=>[err,null]);
	for(var i=0;i<result.length;i++){
		[err,bb] = await getOneMsg(data.uid,result[i].id).then(data => [null,data]).catch(err=>[err,null]);
		 
		if(bb.types==0){

		}else if(bb.types==1){
			bb.message = '[圖片]';
		}else if(bb.types ==2){
			bb.message = '[音頻]';
		}else if(bb.types==3){
			bb.message = '[位置]';
		}
		result[i].msgUserName = bb.msgUserName;
		result[i].msg= bb.message;
		[err,cc] = await unreadMsg(data.uid,result[i].id).then(data=>[null,data]).catch(err=>[err,null]);		
		result[i].tip = cc;
	}
	if(err){
		res.send(err);
	}else{
		res.send({status:200,result});
	}
}
exports.getUsers = function(data,res){
	doIt(data,res);
}
//一對一訊息狀態修改
exports.updateMsg = function(data,res) {
	let wherestr = {'userID':data.uid,'friendID':data.fid,'state':1}; //1未讀
	//修改變已讀
	let updatestr = {'state':0};
	Message.updateMany(wherestr,updatestr,(err,result) =>{
		if(err){
			res.send({status:500});
		}else{
 			res.send({status:200});
		}
	});
}

//新建群組
exports.acreateGroup = function(data,res){
	let groupData = {
		userID: data.uid,
		name: data.name,
		imgurl: data.imgurl, 
		time: new Date(),
	};
	var group = new Group(groupData);
	group.save(function(err,result){
		if(err){
			console.log({status:500});
		}else{
			Group.find({'userID': data.uid, 'name':data.name},{'_id':1},function(err,rest){
				if(err){
					res.send({status:500});
				}else{
					//添加群組及群組成員
					rest.map(function(gid){ //取出rest(數組)的資料 要用map
						//添加群組管理員進入
						let udata = {
							groupID: gid._id,
							userID: gid.uid,
							time: new Date(),
							lastTime : new Date(),
						};
						//加入
						this.insertGroupUser(udate);
						//添加好友入群
						for(let i=0;i=data.user.length;i++){
						 
							let fdata = {
							groupID: gid._id,
							userID: data.user[i],
							time: new Date(),
							lastTime : new Date(),
						};
						//加入
						this.insertGroupUser(fdate);
						 }
					})	
					res.send({status:200});
				}
			});
		}
	});
}

//添加群組成員
exports.insertGroupUser =function(data,res){
	var groupuser = new GroupUser(data);
	groupuser.save(function(err,res){
			if(err){
				res.send({status:500});
			}else{
				console.log('添加群組成員成功');
			}
	})
}

exports.createGroup = function(data,res){

	return new Promise(function(resolve,reject){
		let groupData = {
			userID: data.uid,
			name: data.name,
			imgurl: data.imgurl, 
			time: new Date(),
		};
		var group = new Group(groupData);
		group.save(function(err,result){
			if(err){
				reject({status:500});
			}else{
				resolve({result});
			}
		});
	}).then((value)=>{//result被存入value
			for(let i=0;i<data.user.length;i++){
			let fdata = {
				groupID: value.result._id,
				userID: data.user[i],
				time: new Date(),
				lastTime : new Date(),
			};
			//加入
			this.insertGroupUser(fdata);
		 }

		 res.send({status:200,rest:value} );
	}).catch(function onRejected(error){
		res.send(error); //error=上面的reject({status:500});
	});
}


//獲取群組列表
/*exports.getGroup = function(uid,res){ //id為用戶所在的群組
	let query = GroupUser.find({});
	query.where({'userID':uid}); //查詢條件
	query.populate('groupID');
	query.sort({'lastTime':-1}); //根據lasttime進行排序 -1由大到小(倒敘)排列  最前面為最新的資料
	query.exec().then(function(e){
		let result = e.map(function(ver){
			return {
				gid:ver.groupID._id, 
				name:ver.groupID.name, 
				markname:ver.name, 		//群組名字	
				imgurl:ver.groupID.imgurl,
				lastTime:ver.lastTime,
				tip :ver.tip,
				type: 1,//群組標記
			};
		});
		res.send({status:200,result});
	}).catch(function(err){ //沒查到東東
		res.send({status:500});
	});
}*/

function getGroup(uid){  
	return new Promise(function(resolve,reject){
	let query = GroupUser.find({});
	query.where({'userID':uid}); //查詢條件
	query.populate('groupID');
	query.sort({'lastTime':-1}); //根據lasttime進行排序 -1由大到小(倒敘)排列  最前面為最新的資料
	query.exec().then(function(e){
		let result = e.map(function(ver){
			return {
				gid:ver.groupID._id, 
				name:ver.groupID.name, 
				markname:ver.name, 		//群組名字	
				imgurl:ver.groupID.imgurl,
				lastTime:ver.lastTime,
				tip :ver.tip,
				type: 1,//群組標記
			};
		});
		resolve(result);
	}).catch(function(err){ //沒查到東東
		reject({status:500});
	});
})
}


//獲取群組訊息
/*exports.getOneGroupMsg = function(gid,res){
	let query = GroupMsg.findOne({});
	query.where({'groupID':gid}); //查詢條件
	query.populate('userID');
	query.sort({'time':-1}); //根據lasttime進行排序 -1由大到小(倒敘)排列  最前面為最新的資料
	query.exec().then(function(ver){
	
		let result= {
			message:ver.message,
			time:ver.time,
			types:ver.types,
			name : ver.userID.name,
		};

		res.send({result:200,result});
	}).catch(function(err){ //沒查到東東
		res.send({status:500});
	});
}*/

/*function getOneGroupMsg(gid){
	return new Promise(function(resolve,reject){
		let query = GroupMsg.findOne({});
		query.where({'groupID':gid}); //查詢條件
		query.populate('userID');
		query.sort({'time':-1}); //根據lasttime進行排序 -1由大到小(倒敘)排列  最前面為最新的資料
		query.exec().then(function(ver){
			let result= {
				message:ver.message,
				time:ver.time,
				types:ver.types,
				name : ver.userID.name,
			};
			console.log("bb : "+result);
			resolve(result);
		}).catch(function(err){ //沒查到東東
			reject({status:500});
			
		});
	});
}
*/
function getOneGroupMsg(gid){
	return new Promise(function(resolve,reject){
		let query = Message.findOne({});
			query.where({'friendID':gid}); //查詢條件
			query.populate('userID');
			query.sort({'time':-1}); //根據lasttime進行排序 -1由大到小(倒敘)排列  最前面為最新的資料
			query.exec().then(function(ver){
			let result= {
				message:ver.message,
				time:ver.time,
				types:ver.types,
				name : ver.userID.name,
			};
			
			resolve(result);
		}).catch(function(err){ //沒查到東東
			reject({status:500});
			
		});
	});
}
async function doItg(data,res){
	let result,bb,cc,err;
	[err,result] = await getGroup(data).then(data=> [null,data]).catch(err=>[err,null]);
	
	for(var i=0;i<result.length;i++){
		
		[err,bb] = await getOneGroupMsg(result[i].gid).then(data => [null,data]).catch(err=>[err,null]);
		//console.log("bb : "+result[i].gid);
		//console.log(bb);
		if(err){result[i].msg= ' '; continue;} //沒查到 無訊息 跳過
		console.log(result[i].name+" tip: "+result[i].tip)
		result[i].userName = bb.name;
		if(bb.types=='0'){
		}else if(bb.types=='1'){
			bb.message = '[圖片]';
		}else if(bb.types =='2'){
			bb.message = '[音頻]';
		}else if(bb.types=='3'){
			bb.message = '[位置]';
		}
		result[i].msg= bb.message;
		result[i].lastTime = bb.time;
		//[err,cc] = await unreadMsg(data.uid,result[i].id).then(data=>[null,data]).catch(err=>[err,null]);		
		//result[i].tip = cc;
	}
	if(result){
		res.send({status:200,result});
	}else{
		res.send(err);
	}
}


exports.getGroup = function(data,res){
	doItg(data,res);
}

//群組消息已讀
exports.updateGroupMsg=function(data,res) {
	updateGroupMsg(data,res);
}
//群組消息已讀
function updateGroupMsg(data,res) {
	let wherestr = {'userID':data.uid,'groupID':data.fid};  
	//修改變已讀
	let updatestr = {'tip':0};
	GroupUser.updateOne(wherestr,updatestr,(err,result) =>{
		if(err){
			console.log({status:500});
			if(res){
				res.send({status:500});
			}
			 
		}else{
 			console.log({status:200});
 			if(res){
 			 res.send({status:200});
 			 }
		}
	});
}

//一對一消息已讀
exports.updatefriendMsg=function(data,res) {
	updatefriendMsg(data,res);
}

//一對一消息已讀
function updatefriendMsg(data,res) {
	let wherestr = {'userID':data.fid,'friendID':data.uid}; //1已讀
	//修改變已讀
	let updatestr = {'state':1};
	let pass = 0;
	Message.updateMany(wherestr,updatestr,(err,result) =>{
		if(err){
			console.log({status:500});
			if(res){
				res.send({status:500});
			}
			 
		}else{
 			console.log({status:200});
 			if(res){
 			 res.send({status:200});
 			 }
		}
	});

}

//訊息操作
//分頁獲取一對一數據
exports.msg = function(data,res){
	var skipNum = data.nowPage * data.pageSize; //跳過多少條訊息
	//
	let wherestr = {'userID':data.uid,'groupID':data.fid};
	GroupUser.countDocuments(wherestr,(err,result) =>{
		if(err){
			res.send({status:500});
		}else{
			
			if(result == 0){//使用fid查不到相應的群組，意思為 此fid為好友的  而不是群組的
					updatefriendMsg(data);
					let query = Message.find({});
					query.where({$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]}); //查詢條件
					query.populate('userID');
					query.sort({'time':-1}); 
					//跳過的條數
					query.skip(skipNum);
					//一頁限制幾條
					query.limit(data.pageSize);
					//輸出頁面結果
					query.exec().then(function(e){
						let result = e.map(function(ver){
							return {
								id: ver._id,
								message: ver.message,
								types:ver.types,
								time:ver.time,
								fromId: ver.userID._id,
								imgurl: ver.userID.imgurl,
							};
						});
						res.send({status:200,result});
					}).catch(function(err){
						res.send({status:500});
					});
			}else{ //>0 表示用此fid可以查到群組，即此fid是群組的
					updateGroupMsg(data);
					let query = Message.find({});
					query.where({'friendID':data.fid}); //查詢條件
					query.populate('userID');
					query.sort({'time':-1}); 
					//跳過的條數
					query.skip(skipNum);
					//一頁限制幾條
					query.limit(data.pageSize);
					//輸出頁面結果
					query.exec().then(function(e){
						let result = e.map(function(ver){
							return {
								id: ver._id,
								message: ver.message,
								types:ver.types,
								time:ver.time,
								fromId: ver.userID._id,
								imgurl: ver.userID.imgurl,
							};
						});
						res.send({status:200,result});
					}).catch(function(err){
						res.send({status:500});
					});
				
			}
		}
	});





}

 
 
/*
exports.findUser = function(res){
	//User.find(a,b,function(err,val){}); //查找條件 輸出條件 輸出結果
	Todos.find(function(err,val){
		if(err){
			console.log("資料查詢失敗: "+err);
		}else{
			res.send(val);
			console.log("資料查詢");
		}
	}); 
}*/