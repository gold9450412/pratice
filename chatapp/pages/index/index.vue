<template>
	<view class="content">
		<view class= "top-bar">
			<navigator :url="'../userhome/userhome?id='+uid"  hover-class="none" class= "top-bar-left">
				<image class="my-img" :src="imgurl"></image>
			</navigator>
			<view class="top-bar-center">
				<image class="logo" src="../../static/images/index/ducky.png" ></image>
			</view>
			<view class="top-bar-right">
				<view class="search" @tap="toSearch">
					<image src="../../static/images/index/loupe.png"></image>
				</view>
				<view class ="add" @tap="tobuildGroup">
					<image src="../../static/images/index/add.png"></image>
				</view>
				
			</view>
		</view>
		<!-- {{ChangeTime(item2.time)}} -->
		<view class="main">		
		<view class="refresh" v-if="!refresh">
			<image src="../../static/images/index/refresh.png"></image>
			<view class="ref-title">下拉更新</view>
	    </view>
		<view class="noone" v-if="noone">
			<image mode="aspectFill" src="../../static/images/index/alone.png"></image>
			<view class="no-title">目前尚未有好友!!</view>
			<view class="search-bt" @tap="toSearch">搜尋好友</view>
		</view>
		<view class="friend" v-if="requestData>0" @tap="goRequest">
			<view class="friend-list">
				<view class="friend-list-l">
					<view class="tip" >{{requestData}}</view>
					<image src="../../static/images/img/add-user.png"></image>
				</view>
				<view class="friend-list-r">
					<view class="top">
						<view class="name">好友邀請</view>
						<view class="time">{{ChangeTime(requestTime)}}</view>
					</view>
					<view class="news">目前有{{requestData}}位好友邀請</view>
				</view>
			</view>
		</view>
		<view class="friend">
			<view class="friend-list" @tap="toChatRoom(item2)" v-for="(item2,index) in friends" :key="item2.id">
				<view class="friend-list-l">
					<view v-if="item2.tip>0" class="tip">{{item2.tip}}</view>
					<image :src="item2.imgurl"></image>
					<view class="groupm" v-if="item2.type == 1"></view>
				</view>
				<view class="friend-list-r">
					<view class="top">
						<view class="name">{{item2.name}}</view>
						<view class="time">{{ChangeTime(item2.lastTime)}}</view>
					</view>
					<view class="news">{{item2.msg}}</view>
				</view>
			</view>
		</view>
		</view>

		
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js';
	import myfun from '../../commons/js/myfun.js';
	export default {
		data() {
			return {
				friends:[],
				groups:[],
				uid:'',
				imgurl:'',
				token:'',
				requestData:0, //好友申請數
				requestTime:'', //最後申請時間
				myname:'',
				//沒好友時
				refresh:false, 
				noone:false,
			}
		},
		onLoad:function(e) {
			this.getStorages();
			this.getGroup();
			this.getFriends();
			this.friendRequest();
			this.join(this.uid);
			this.receiveSocketMsg();	
			this.groupSocket();
		},
		onPullDownRefresh:function()  {
			this.friends=[];
			this.groups=[];
			this.getStorages();
			this.friendRequest();
			this.getFriends();
			this.getGroup();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			ChangeTime: function(date){
				return myfun.dateTime(date);
			},
			//獲取緩存
			getStorages: function(){
				try{
					const value = uni.getStorageSync('user');
					if(value){
						console.log(value);
						this.uid = value.id;
						this.imgurl = this.serverUrl+value.imgurl;
						this.token = value.token;
						this.myname = valur.name;
					}else{
						//如果不存在緩存，跳回登入頁面
						uni.navigateTo({
							url:'../signin/signin',
						})
					}
				}catch(e){
					
				}
			},
			getFriends1: function(){
				this.friends = datas.friends();
				for (let i=0 ; i<this.friends.length;i++)
				this.friends[i].imgurl = '../../static/images/img/'+ this.friends[i].imgurl;
				//console.log(this.friends);
			},
			friendRequest: function(){
				uni.request({
					url:this.serverUrl+'/index/getfriend',
					data:{
						uid: this.uid,
						state : 1, //申請狀態
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						this.refresh=true;
						let status = data.data.status;
						if(status==200){//訪問後端成功
							this.noone = false;
							let res= data.data.result;
							this.requestData = res.length;
							if(res.length > 0){
								this.requestTime =res[0].lastTime;
								for(let i=0;i<res.length;i++){
									if(this.requestTime<res[i].lastTime){
										this.requestTime = res[i].lastTime;
										console.log("時間 "+this.requestTime );
									}
								}
							}else if(this.friends.length ==0){ //沒有好友時
								this.noone = true;
							}

						
						}else if(status==400){
								//非好友
								this.relation = 2;
								//console.log("好友:"+this.relation);
							}
						else if(status==500){
							uni.showToast({
								title:'伺服器出錯!!',
								icon:'none',
								duration:1500,
							});
						}else if(status==300){//token過期 跳回登入頁面
									uni.navigateTo({
										url:'../signin/signin?name='+this.myname,
									});
							}
						
					}
				})
			},
			toSearch: function(){
				uni.navigateTo({url: '../search/search',});
			},
			tobuildGroup:function(){
				uni.navigateTo({url: '../buildgroup/buildgroup',});
			},
			goRequest:function(){
				uni.navigateTo({url: '../friendrequest/friendrequest',});
				
			},
			getLastMsg: function(arr,i){
				uni.request({
					url:this.serverUrl+'/index/getlastmsg',
					data:{
						uid: this.uid,
						fid : arr[i].id,  
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						let status = data.data.status;		 
						if(status==200){//訪問後端成功
							let res = data.data.result;
							if(res.types==0){
								//文字
							}else if(res.types==1){
								//圖片
								res.message = '[圖片]';
							}else if(res.types==2){
								//音頻
								res.message = '[音頻]';
							}else if(res.types==3){
								//圖片
								res.message = '[位置]';
							}
							let e = arr[i];
							e.msg = res.message;
							arr.splice(i,1,e);
						}else if(status==500){
							uni.showToast({
								title:'伺服器出錯!!',
								icon:'none',
								duration:1500,
							});
						}else if(status==300){//token過期 跳回登入頁面
									uni.navigateTo({
										url:'../signin/signin?name='+this.myname,
									});
							}
						
					}
				})
			},
			//未讀消息數
			getUnread: function(arr,i){
				uni.request({
					url:this.serverUrl+'/index/unreadmsg',
					data:{
						uid: this.uid,
						fid : arr[i].id,  
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						let status = data.data.status;				 
						if(status==200){//訪問後端成功
							let res = data.data.result;
							let e = arr[i];
							e.tip= res;
							arr.splice(i,1,e);
						}else if(status==500){
							uni.showToast({
								title:'伺服器出錯!!',
								icon:'none',
								duration:1500,
							});
						}else if(status==300){//token過期 跳回登入頁面
									uni.navigateTo({
										url:'../signin/signin?name='+this.myname,
									});
							}
						
					}
				})
			},
			//好友列表
			getFriends: function(){
				uni.request({
					url:this.serverUrl+'/index/getfriend',
					data:{
						uid: this.uid,
						state : 0, //好友狀態
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						this.refresh = true;	
						let status = data.data.status;				 
						if(status==200){//訪問後端成功
							let res= data.data.result;
							if(res.length>0){
							this.noone = false;
							for(let i=0; i<res.length;i++){
								res[i].imgurl=this.serverUrl+'/'+res[i].imgurl;		
								if(res[i].markname){
									res[i].name = res[i].markname;
								}
							
								res[i].msg = res[i].msgUserName +": "+res[i].msg;
								//這裡還要拼接群組數組  所以不能用等於 要用push 一個一個接上去
								this.friends.push(res[i]);	
								console.log(res[i]);
								}	
								this.isOk(this.groups);
							}else{
								this.noone = true;
							}
							//群組列表
							//this.getGroup();
							//this.friends=myfun.sortTime(this.friends,'lastTime',0);
							/*for(let i=0;i<this.friends.length;i++){
								this.getLastMsg(this.friends,i);
								this.getUnread(this.friends,i);
							}*/
						}else if(status==500){
							uni.showToast({
								title:'伺服器出錯!!',
								icon:'none',
								duration:1500,
							});
						}else if(status==300){//token過期 跳回登入頁面
									uni.navigateTo({
										url:'../signin/signin?name='+this.myname,
									});
							}
						
					}
				})
			},
			//群組列表
			getGroup: function(){
				uni.request({
					url:this.serverUrl+'/index/getgroup',
					data:{
						uid: this.uid,
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						let status = data.data.status;	
						//console.log(status);
						if(status==200){//訪問後端成功
							let res= data.data.result;
							
							if(res.length>0){
							for(let i=0; i<res.length;i++){
								res[i].imgurl=this.serverUrl+'/'+res[i].imgurl;							 
								//這裡還要拼接群組數組  所以不能用等於 要用push 一個一個接上去
								res[i].id = res[i].gid;
								if(res[i].userName){
								res[i].msg = res[i].userName +': '+res[i].msg;
								}
								this.groups.push(res[i])
								console.log(res[i]);
								this.socket.emit('group',res[i].gid);
								}
							}
							 this.isOk(this.friends);
							//console.log(this.groups);
							/*for(let i=0;i<this.friends.length;i++){
								this.getLastMsg(this.friends[i].id);
							}*/
						}else if(status==500){
							uni.showToast({
								title:'伺服器出錯!!',
								icon:'none',
								duration:1500,
							});
						}else if(status==300){//token過期 跳回登入頁面
									uni.navigateTo({
										url:'../signin/signin?name='+this.myname,
									});
							}
						
					}
				})
			},
			//群接收訊息
			groupSocket: function(){
				this.socket.on('groupmsg',(msg,gid,name,img,tip)=>{
					let nmsg = '';
					console.log(tip);
					console.log(name);
					if(msg.types == 0){
						nmsg = msg.message;
					}else if(msg.types == 1){
						nmsg = '[圖片]';
					}else if(msg.types == 2){
						nmsg = '[音頻]';
					}else if(msg.types == 3){
						nmsg = '[位置]';
					}
					for(let i=0;i<this.friends.length;i++){
						if(this.friends[i].id == gid && tip == 0){
							let e = this.friends[i];
							e.lastTime = new Date();
							e.msg = name+': '+nmsg;
							e.tip++;
							//刪除原來數據
							this.friends.splice(i,1);
							//新訊息插入到最頂部
							this.friends.unshift(e);
						}
					}
				});
			},
			
			//群與好友排序
			isOk: function(e){
				if(e.length>0){
					this.friends = this.friends.concat(this.groups);//將2陣列拼接
					this.friends = myfun.sortTime(this.friends,'lastTime',0); //訊息依照時間排序
				}
				
			},
			toChatRoom:function(data){
				
				uni.redirectTo({
					url: '../chatroom/chatroom?id='+data.id+'&name='+data.name+'&img='+data.imgurl+'&type='+data.type,
				}) //type 0為一對一  1為群組聊天
			},
			//socket模塊
			//用戶登入socket註冊
			join: function(uid){
				this.socket.emit('login',uid); //用戶上首頁時 會用socket發送訊息 告知後端 此用戶上線了
				
			},
			//用戶接收socket測試
			sockettest: function(){
				this.socket.on('msg',id=>{
					console.log('後端發送的消息為: '+id);
				})
			},
			//1對1數據接收
			receiveSocketMsg: function(){
				this.socket.on('msg',(msg,fromid,tip)=>{
					let nmsg = '';
					if(msg.types == 0){
						nmsg = msg.message;
					}else if(msg.types == 1){
						nmsg = '[圖片]';
					}else if(msg.types == 2){
						nmsg = '[音頻]';
					}else if(msg.types == 3){
						nmsg = '[位置]';
					}
					for(let i=0;i<this.friends.length;i++){
						if(this.friends[i].id == fromid && tip == 0){
							let e = this.friends[i];
							e.lastTime = new Date();
							e.msg = this.friends[i].name+": "+nmsg;
							e.tip++;
							//刪除原來數據
							this.friends.splice(i,1);
							//新訊息插入到最頂部
							this.friends.unshift(e);
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
/* 	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-bottom: var(--status-bar-height);
	} */
	page {
	background-color: #f7f5e3;
	}
	.top-bar{
		background:rgba(228, 254, 255, 1.0);//帶透明度
		border-bottom: 2px solid $uni-border-color;
		.top-bar-right{
			image{
				
				padding: 18rpx 0 0 18rpx;
				width: 45rpx;
				height: 45rpx;
			}
		}
	}
  /*  .top-bar {
		z-index: 1001;
		position: fixed;
		top:0;
		left: 0;
		width: 100%;
		height: 68rpx;
		background:$uni-bg-color;
		//box-sizing: border-box;
		padding-top: var(--status-bar-height);
		 //box-shadow:0px 1px 0px 0px rgba(0, 0,0, 0.1);
		border-bottom: 2px solid $uni-border-color;
		padding-left: $uni-spacing-col-base;
		padding-right: $uni-spacing-col-base;
		.top-bar-left {
			float: left;	
			image{
				width: 68rpx;
				height: 68rpx;
				border-radius: 16rpx;
			}
		}
		.top-bar-center{
		position: absolute;
		text-align: center;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	 
		margin: auto;
		.logo{
			 
			padding-top: 9rpx;
			width: 88rpx;
			height: 50rpx;
		}
	}
	
		.top-bar-right{
		padding-right: 36rpx;	
		float:right;
			.search{
			display: inline-block;
			 width: 88rpx;
			 height: 88rpx;
			 
		}
			.add{
			display: inline-block;	
			 width: 88rpx;
			 height: 88rpx;
		}
		image{ 
			
			padding: 18rpx 0 0 18rpx;
			width: 45rpx;
			height: 45rpx;
		}
	}

	} */
	.main{ 
		width: 100%;
		position: fixed;
		left: 0;
		top: 104rpx;
		
		//padding-top: 104rpx ;
		.refresh{
			text-align: center;
			padding-top: 480rpx;
			image{
				width: 32rpx;
				height: 32rpx;
			}
			.ref-title{
				padding-top: 10rpx;
				font-size: $uni-font-size-base;
				width: 115rpx;
				height: 40rpx;
				color:rgba(39,40,50,0.4);
				line-height: 40rpx;
				
			}
		}
		.noone{
			text-align: center;	 
			padding-top: 400rpx;
			image{
				height: 250rpx;
				width: 158rpx;
				filter: blur(2px);
			}
			.no-title{			 
				margin: auto;
				padding: 32rpx 0;
				font-size: $uni-font-size-base;
				width: 220rpx;
				height: 40rpx;
				color:rgba(39,40,50,0.4);
				line-height: 40rpx;	
			
			}
			.search-bt{
				display: inline-block;
				width: 240rpx;
				height: 96rpx;
				background: $uni-color-primary;
				box-shadow: 0px 52rpx 36rpx -32rpx rgba(255,228,49,0.4);
				border-radius: 48rpx;
				font-size: $uni-font-size-base;
				color:$uni-text-color;
				line-height: 96rpx;	
			}
		}
		.friend-list{
			
			height: 96rpx;
			padding: 16rpx $uni-spacing-col-base;
			&:active{  //等同html @tap 點擊後的效果
				background-color: $uni-bg-color-grey;
			}
			.friend-list-l{

				position: relative;
				float: left;
				image{
					width: 96rpx;
					height: 96rpx;
					border-radius: $uni-border-radius-base;
					background-color: $uni-color-primary;
				}
				.tip{
					position: absolute;
					z-index: 10;
					top:-8rpx;
					left:68rpx;
					min-width:20rpx ;
					padding: 0 8rpx;
					height: 36rpx;
					background: $uni-color-warning;
					border-radius: 18rpx;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-inverse;
					line-height: 36rpx;
					text-align: center;
				}
				.groupm{
					position: absolute;
					z-index: 10;
					bottom: 8rpx;
					right:0rpx;
					width:16rpx ;
					height: 16rpx;
					background: $uni-color-primary;
					border-radius: 8rpx;
					opacity: 0.8;
					box-shadow: 0 0.2rpx 12rpx rgba(0,0,0,0.2);
				}
			}
			.friend-list-r{	 
				padding-left: 128rpx;
				.top{
					height: 50rpx;
					.name{		 
						font-size: 36rpx;
						font-weight: 400;
						color: $uni-text-color;
						line-height: 50rpx;
					}
					.time{
						float:right;	 
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						line-height: 50rpx;
					}
				}
			}
		}
		.news{
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}
	}

</style>
