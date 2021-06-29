<template>
	<view class="content">
		<view class= "top-bar">
			<view class="top-bar-left" @tap="toSignIn">
				<image src="../../static/images/common/arrow.png" class="back-img"></image>
		    </view>
			<view class="top-bar-center">
				<view class="title">
					{{fname}}
				</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
				<view class="group-img" v-if="type == 1" @tap="goGroupHome">
					<image :src="fimgurl"></image>
				</view>
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" :scroll-with-animation="swanition" :scroll-into-view="scrollToView" @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:input+'px'}">
				<view class="loading" :class="{displaynone:isloading}">
					<image src="../../static/images/chatroom/loading.png" class="loading-img" :animation="animationDate"></image>
				</view>
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.id">
					<view class="chat-time" v-if="item.time !=''">{{changeTime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.fromId!= uid">
						<image class="user-img" :src="item.imgurl"></image>
						<view class="message" v-if="item.types==0">
							<view class="msg-text">{{item.message}}</view>
						</view>		
						<view class="message" v-if="item.types==1" >
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg"></image>
						</view>	
						<view class="message" v-if="item.types==2" >
							<view class="msg-text voice" :style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
								<image src="../../static/images/chatroom/speaker.png" class="voice-img"></image>
								{{item.message.time}}"
							</view>
						</view>	
						<view class="message" v-if="item.types==3" >
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<!--因為有層級問題 暫時取消> 
								<map class="map" :longitude="item.message.longitude" :latitude="item.message.latitude" :markers="covers(item.message)"></map>
								-->
								<image class="map-img" src="../../static/images/chatroom/map.png" mode="aspectFit"></image>
							</view>		
						</view>	
					</view>
					<view class="msg-m msg-right" v-if="item.fromId == uid">
						<image class="user-img" :src="item.imgurl"></image>
						<!--type=0文字 =1圖片 =2聲音-->
					<view class="message" v-if="item.types==0">
						<view class="msg-text">{{item.message}}</view>
					</view>		
						<view class="message" v-if="item.types==1" >
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message) "></image>
						</view>			
						<view class="message" v-if="item.types==2" >
							<view class="msg-text voice":style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
								{{item.message.time}}"
								<image  src="../../static/images/chatroom/speaker.png" class="voice-img"></image>
							</view>
						</view>		
						<view class="message" v-if="item.types==3" >
							<view class="msg-map" @tap="openLocation(item.message)"> 
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<!--因為有層級問題 暫時取消> 
								<map class="map" :longitude="item.message.longitude" :latitude="item.message.latitude" :markers="covers(item.message)"></map>
								-->
								<image class="map-img" src="../../static/images/chatroom/map.png" mode="aspectFit"></image>
							</view>			
						</view>		
						
					</view>
				</view>
			</view>		
			<view class="padbt"></view>
		</scroll-view>
		<submit class="apple" @inputss= "mess" @heights="getheights"> </submit>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js';
	import myfun from '../../commons/js/myfun.js';
	import submit from "@/components/submit/submit.vue";
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		data() {
			return {
				uid:'',
				uimgurl:'',
				token:'',
				uname:'',
				msgs:[],
				imgMsg:[],
				oldTime:new Date(),
				scrollToView:'',
				input:'60',
				animationDate:{},
				nowpage:0,
				loading:'',
				isloading:true,
				swanition:true,
				beginloading:true,
				type:0, //0為好友 1群組
				pagesize:10, //一頁10條
			};
		},
		onLoad:function(e){
			this.fid = e.id;
			console.log(e.id);
			this.fname = e.name;
			this.type =e.type;
			this.fimgurl = e.img;
			this.getStorages();
			this.getMsg();
			this.receiveSocketMsg();
			this.groupSocketMsg();
			//this.getMsg(this.nowpage);
			//this.nextPage();
		},
		components:{submit,},
		methods:{
			//獲取緩存
			getStorages: function(){
				try{
					const value = uni.getStorageSync('user');
					if(value){
						console.log(value);
						this.uid = value.id;
						this.uimgurl = this.serverUrl+value.imgurl;
						this.token = value.token;
						this.uname = value.name;
					}else{
						//如果不存在緩存，跳回登入頁面
						uni.navigateTo({
							url:'../signin/signin',
						})
					}
				}catch(e){
					
				}
			},
			toSignIn: function(){
				//uni.navigateBack({delta:1, });  //返回一層
				if(this.type==0){
					this.updateRead();
				}else{
					
					this.updateGroupRead();
				}
				
			},
			changeTime:function(date){
				return myfun.dateTime1(date);
			},
			getMsg1: function(page){			
					let msg = datas.message();
					let maxpapes = msg.length;
					if(msg.length>(page+1)*10){
						maxpapes=(page+1)*10;
						this.nowpage++;
					}else{
						//頁面載入完畢
						this.nowpage=-1;
					}
					for(var i=page*10;i<maxpapes;i++){
						msg[i].imgurl='../../static/images/img/'+msg[i].imgurl;
						let t  =myfun.spacTime(this.oldTime,msg[i].time);
						if(i<msg.length-1){
						if(t){
							this.oldTime=t;
							
						}
						msg[i].time=t;
						}
						if(msg[i].types==1){
							msg[i].message='../../static/images/img/'+msg[i].message;
							this.imgMsg.unshift(msg[i].message);
						}
						this.msgs.unshift(msg[i]);//unshift的用法
					}
					//console.log(this.msgs);
					this.scrollToView='';

					this.$nextTick(function(){
						this.swanition=false;
						//this.scrollToView='msg'+this.msgs[i-1].tip; //nextTick 必須裡面的值有改變 才能觸發，所以this.scrollToView=''; 是必須的
						console.log(this.scrollToView);
						this.scrollToView='msg'+this.msgs[maxpapes-page*10-1].tip;
					});
					clearInterval(this.loading); //載入完 關閉nextPage的計時
					this.isloading=true;
					this.beginloading=true;
				},
				getMsg: function(){
					
						uni.request({
							url:this.serverUrl+'/chat/msg',
							data:{
								uid: this.uid,
								fid: this.fid,
								nowPage : this.nowpage,
								pageSize: this.pagesize,
								token:this.token,
							},
							method: 'POST',
							success:(data)=>{	
								let status = data.data.status;	
								if(status==200){//訪問後端成功
									let msg= data.data.result;
									console.log(data);
									if(msg.length>0){
										for(var i=0;i<msg.length;i++){ 
											msg[i].imgurl=this.serverUrl+'/'+msg[i].imgurl;
											let t  =myfun.spacTime(this.oldTime,msg[i].time);
											if(i<msg.length-1){
											if(t){
												this.oldTime=t;
												
											}
											msg[i].time=t;
											}
											if(msg[i].types==1){
												msg[i].message=this.serverUrl+'/'+msg[i].message;
												this.imgMsg.unshift(msg[i].message);
											}
											//json string還原
											if(msg[i].types==3){
												msg[i].message= JSON.parse(msg[i].message);
											}
											this.msgs.unshift(msg[i]);//unshift的用法
										}
										//判斷nowPage
										if(msg.length == 10){  //取出來的頁面等於10則  進到下一頁
											this.nowpage++;
										}else{ //取出來的頁面不到10則
											//頁面載入完畢
											this.nowpage=-1;
										}
										
										this.$nextTick(function(){
											this.swanition=false;
											//this.scrollToView='msg'+this.msgs[i-1].tip; //nextTick 必須裡面的值有改變 才能觸發，所以this.scrollToView=''; 是必須的
											this.scrollToView='msg'+this.msgs[msg.length-1].id;
											console.log("msg: "+this.scrollToView);
										});
										clearInterval(this.loading); //載入完 關閉nextPage的計時
										this.isloading=true;
										this.beginloading=true;
									}
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
				// 		for(var i=page*10;i<maxpapes;i++){
				// 			msg[i].imgurl='../../static/images/img/'+msg[i].imgurl;
				// 			let t  =myfun.spacTime(this.oldTime,msg[i].time);
				// 			if(i<msg.length-1){
				// 			if(t){
				// 				this.oldTime=t;
								
				// 			}
				// 			msg[i].time=t;
				// 			}
				// 			if(msg[i].types==1){
				// 				msg[i].message='../../static/images/img/'+msg[i].message;
				// 				this.imgMsg.unshift(msg[i].message);
				// 			}
				// 			this.msgs.unshift(msg[i]);//unshift的用法
				// 		}
				// 		//console.log(this.msgs);
				// 		this.scrollToView='';
				
				// 		this.$nextTick(function(){
				// 			this.swanition=false;
				// 			//this.scrollToView='msg'+this.msgs[i-1].tip; //nextTick 必須裡面的值有改變 才能觸發，所以this.scrollToView=''; 是必須的
				// 			console.log(this.scrollToView);
				// 			this.scrollToView='msg'+this.msgs[maxpapes-page*10-1].tip;
				// 		});
				// 		clearInterval(this.loading); //載入完 關閉nextPage的計時
				// 		this.isloading=true;
				// 		this.beginloading=true;
					},
			//更新一對一已讀 並返回主頁(index)		
			updateRead: function(){
				uni.request({
					url:this.serverUrl+'/chat/updatefriendmsg',
					data:{
						uid: this.uid,
						fid: this.fid,
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{	
						let status = data.data.status;	
						
						if(status==200){//訪問後端成功
							console.log('更新已讀成功');
							uni.redirectTo({url: '../index/index'}); 
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
			//更新群組已讀 並返回主頁(index)
			updateGroupRead: function(){
				uni.request({
					url:this.serverUrl+'/group/updategroupmsg',
					data:{
						uid: this.uid,
						fid: this.fid,
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{	
						let status = data.data.status;	
						
						if(status==200){//訪問後端成功
							console.log('更新已讀成功');
							uni.redirectTo({url: '../index/index'}); 
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
			previewImg: function(e){
						let index=0;
						for(let i=0;i<this.imgMsg.length;i++){
							if(this.imgMsg[i]==e){
								index=i;
							}
						}
				        uni.previewImage({
							current: index,
				            urls: this.imgMsg,
				            longPressActions: {
				                itemList: ['发送给朋友', '保存图片', '收藏'],
				                success: function(data) {
				                    console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				                },
				                fail: function(err) {
				                    console.log(err.errMsg);
				                }
				            }
				        });
			},
			mess:function(e){
				this.receiveMsg(e,this.uid,this.uimgurl,0);
			},
			//接收訊息
			receiveMsg: function(e,id,img,tip){
				//socket提交
				if(e.types == 0 || e.types == 3){
					//發送給後端
					this.sendSocket(e);
				}
				if(e.types == 1 ){
					this.imgMsg.push(e.message);
					//提交圖片  
					let url = myfun.fileName(new Date());
					const uploadTask = uni.uploadFile({
						url: this.serverUrl+'/files/upload', 
						filePath: e.message,
						name: 'file',
						formData: {
							//'url': 'user',
							'url': url,
							'name': new Date().getTime()+this.uid+Math.ceil(Math.random()*10),
						},
						success: (uploadFileRes) => {
							//let path = 'user/'+uploadFileRes.name;
							console.log(uploadFileRes);
							let data = {
								message: uploadFileRes.data,
								types:e.types,
							}
							this.sendSocket(data);
							//let path = this.serverUrl+uploadFileRes.data;
							//this.img.push(path);
							//console.log(uploadFileRes.data);
						}
					});
					uploadTask.onProgressUpdate((res) => {
						//console.log('上傳進度' + res.progress);
						//console.log('已經上傳' + res.totalBytesSent);
						//console.log('預期資料總長度' + res.totalBytesExpectedToSend);
								
					 
					});
				};
				if(e.types==2){
					//this.imgMsg.push(e.message);
					//提交音頻
					let url = myfun.fileName(new Date());
					const uploadTask = uni.uploadFile({
						url: this.serverUrl+'/files/upload', 
						filePath: e.message.voice,
						name: 'file',
						formData: {
							//'url': 'user',
							'url': url,
							'name': new Date().getTime()+this.uid+Math.ceil(Math.random()*10),
						},
						success: (uploadFileRes) => {
							//let path = 'user/'+uploadFileRes.name;
							console.log(uploadFileRes);
							let data = {
								message: uploadFileRes,
								types:e.types,
							}
							this.sendSocket(data);
							//let path = this.serverUrl+uploadFileRes.data;
							//this.img.push(path);
							//console.log(uploadFileRes.data);
						}
					});
					uploadTask.onProgressUpdate((res) => {
						//console.log('上傳進度' + res.progress);
						//console.log('已經上傳' + res.totalBytesSent);
						//console.log('預期資料總長度' + res.totalBytesExpectedToSend);
								
					 
					});
				};
				
				//tip==0 自己發的訊息  ==1對方
				this.swanition=true;
				let len= this.msgs.length;
				let nowTime = new Date();
				//json字串還原 定位訊息時才要
				if(e.types==3){
					e.message = JSON.parse(e.message);
				}
				let data={			
						fromId: id,
						imgurl:img,
						message:e.message,
						types:e.types,
						time:nowTime,
						id:len,
				};
				let t  =myfun.spacTime(data.time,this.oldTime);
				if(t){
					this.oldTime=data.time;
					t = data.time;
				}
				data.time=t;
				this.msgs.push(data);
				setTimeout(()=>{ //避免發送卡頓
					this.$nextTick(function(){ //重點
						let len= this.msgs.length-1;
						this.scrollToView='msg'+len; //得到最後一條的tip
						console.log("進入"+this.scrollToView);
						//this.goBottom();
						
					});
				},30);
				

			},
			//聊天數據發送後端
			sendSocket: function(e){
				if(this.type == 0){//1對1
					this.socket.emit('msg',e,this.uid,this.fid);
				}else{//群組消息
					this.socket.emit('groupMsg',e,this.uid,this.fid,this.uname,this.uimgurl);
				}
			},
			//1對1數據接收
			receiveSocketMsg: function(){
				this.socket.on('msg',(msg,fromid,tip)=>{
					if(fromid == this.fid && tip == 0){
					this.swanition =true;
					let len = this.msgs.length;
					let nowTime = new Date();
					if(msg.types == 1 || msg.types == 2){
						msg.message = this.serverUrl+msg.message;
					}
					let data={			
							fromId: fromid,
							imgurl:this.fimgurl,
							message: msg.message,
							types: msg.types,
							time:nowTime,
							id:len,
					};
					let t  =myfun.spacTime(data.time,this.oldTime);
					if(t){
						this.oldTime=data.time;
						t = data.time;
					}
					data.time=t;
					this.msgs.push(data);
					if(msg.types == 1){
						this.imgMsg.push(msg.message);
					}
					this.$nextTick(function(){ 
						this.scrollToView='msg'+len; 
					});
				}
				}
				);
			},
			//群訊息接收
			groupSocketMsg: function(){
				this.socket.on('groupmsg',(msg,fromid,name,img,tip)=>{
					if(fromid == this.fid && tip == 0){
					this.swanition =true;
					let len = this.msgs.length;
					let nowTime = new Date();
					if(msg.types == 1 || msg.types == 2){
						msg.message = this.serverUrl+msg.message;
					}
					let data={			
							fromId: fromid,
							imgurl: img,
							message: msg.message,
							types: msg.types,
							time:nowTime,
							id:len,
					};
					let t  =myfun.spacTime(data.time,this.oldTime);
					if(t){
						this.oldTime=data.time;
						t = data.time;
					}
					data.time=t;
					this.msgs.push(data);
					if(msg.types == 1){
						this.imgMsg.push(msg.message);
					}
					this.$nextTick(function(){ 
						this.scrollToView='msg'+len; 
					});
				}
				}
				);
			},
			mess1:function(e){ //inputs
				this.swanition=true;
				let len= this.msgs.length;
				let nowTime = new Date();
			/*	let t  =myfun.spacTime(this.oldTime,nowTime);
				 
				if(t){
				 	this.oldTime=t;
				 	
				}
				nowTime=t;*/
 
			let data={
					fromId: this.uid,
					imgurl:'../../static/images/img/'+'sun.png',
					message:e.message,
					types:e.types,
					time:nowTime,
					tip:len,
			};
			console.log(data.imgurl);
			let t  =myfun.spacTime(data.time,this.oldTime);
			if(t){
				this.oldTime=data.time;
				t = data.time;
			}
			data.time=t;
			this.msgs.push(data);
			setTimeout(()=>{ //避免發送卡頓
				this.$nextTick(function(){ //重點
					let len= this.msgs.length-1;
					this.scrollToView='msg'+len; //得到最後一條的tip
					console.log("進入"+this.scrollToView);
					//this.goBottom();
					
				});
			},30);

			if(e.types==1){
				this.imgMsg.push(e.message);
			}
			//	console.log(e);
			},
			getheights:function(e){
				this.input=e;
				this.goBottom();
			},
			//滾動到底部
			goBottom:function(){
				this.swanition=true;
				this.scrollToView='',
				this.$nextTick(function(){
					let len= this.msgs.length-1;
					this.scrollToView='msg'+this.msgs[len].id; //得到最後一條的tip
	 
				});
				 
			},
		
			//播放聲音
			playVoice:function(e){
				innerAudioContext.autoplay = true;
				innerAudioContext.src=e;
				innerAudioContext.onPlay(()=>{
					console.log(innerAudioContext.src);
				});
			},
			
			//地圖定位
			covers:function(e){
				let map=[{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/submit/placeholder.png',
				}];
				return map;
			},
			//導航
			openLocation:function(e){
				console.log(e.latitude);
				
				console.log(e.longitude);
				const latitude=e.latitude;
				const longitude=e.longitude;
				uni.openLocation({
					latitude:latitude,
					longitude:longitude,
					name:e.name,
					address:e.address,
 
				});
				/*uni.getLocation({
						type:'gcj02',
						success:function(res){
							const latitude=res.latitude;
							const longitude=res.longitude;
							uni.openLocation({
								latitude:latitude,
								longitude:longitude,
								success:function(){
									console.log('成功');
								}
							});
						}
				});*/
			},
			nextPage:function(){
				//beginloading 為了避免重複載入頁面，這邊上了個lock
				if(this.nowpage>0 && this.beginloading){				
				this.isloading=false;
				this.beginloading=false;
				var animation = uni.createAnimation({
					duration:1000,
					timingFunction:'step-start',
				});
				this.animationDate=animation;
				let i=1;
				this.loading =setInterval(function(){
					animation.rotate(i*41).step();
					this.animationDate=animation.export();
					i++;
					//到頂部時，更新
					 if(i>20){
						this.getMsg(this.nowpage);
					} 
				}.bind(this),120);
				}

			},
			goGroupHome:function(){
				uni.navigateTo({url: '../grouphome/grouphome',});
			},
			}
	}
</script>

<style lang="scss">
@import "../../commons/css/mycss.scss";
page{
	height: 100%;
	 
}
.content{
	height: 100%;
	background: rgba(244,244,244,1);
}
.top-bar{
	 
	background: rgba(244,244,244,0.96);
	border-bottom: 1px solid $uni-border-color;
	.group-img{
		position:  absolute;
		bottom: 10rpx;
		right: $uni-spacing-col-base;
		width: 68rpx;
		height: 68rpx;
		margin-right: 16rpx;
		image{
			width: 68rpx;
			height: 68rpx;
			border-radius: 16rpx;
		}
	}
}
	.displaynone{
		display: none;
	}
	.chat{
		height: 100%;
		 .padbt{  //用來增加安全距離的  margin因為未知原因不能用  乾脆直接新增一個空白view
			height: var(--status-bar--height);
			width: 100%;
		} 
		.loading{
			text-align: center;
			.loading-img{
				
				width: 60rpx;
				height: 60rpx;
			}
		}
		.chat-main{
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 100rpx;
			//padding-bottom: 120rpx;
			display: flex;
			flex-direction: column;
		}
		.chat-ls{
			 
			.chat-time{
				font-size: $uni-font-size-sm;
				color: rgba(30,40,50,0.3);
				line-height: 34rpx;
				padding: 20rpx 0;
				text-align: center;
			}
			.msg-m{
				display: flex;
				padding: 20rpx 0;
				.user-img{
					flex:none;
					width: $uni-img-size-sm;
					height: $uni-img-size-sm;
					border-radius: $uni-border-radius-base;
				}
				.message{		
					flex:none;
					max-width: 480rpx;
				}
				.msg-text{ //公用msg-text
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx;
				}
				.msg-img{
					max-width: 400rpx;
					border-radius: $uni-border-radius-base;
				}
				.msg-map{
					background: #fff;
					width: 464rpx;
					height: 284rpx;
					overflow: hidden;
					.map-name{
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx 0 24rpx;
						//單行顯示
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;  
					}
					.map-address{
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						padding: 0rpx 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
					/*.map{
						padding-top: 8rpx;
						width: 464rpx;
						height: 190rpx;
					}*/
					.map-img{
						padding-top: 8rpx;
						width: 480rpx;
						height: 190rpx;
					}
				}
				.voice{
					min-width: 80rpx;
					max-width: 400rpx;
				}
				.voice-img{
					width: 28rpx;
					height: 36rpx;
				}
				
			}
			.msg-left{
				flex-direction: row;
				.msg-text{ //只會改left的訊息
					margin-left: 16rpx;
					background-color: #fff;
					border-radius: 0px 20rpx 20rpx 20rpx;
				}
				.msg-img{
					margin-left:16rpx ;
				}
				.msg-map{
					margin-left: 16rpx;
					border-radius: 0px 20rpx 20rpx 20rpx;
				}
				.voice{
					text-align: right;

				}
				.voice-img{
					float: left;
					padding-top: 4rpx;
					width: 28rpx;
					height: 36rpx;
					
				}
				
			}
			.msg-right{
				flex-direction: row-reverse;
				.msg-text{
					margin-right: 16rpx;
					background-color: #fff260;
					border-radius: 20px 0rpx 20rpx 20rpx;
				}
				.msg-img{
					margin-right:16rpx ;
				}
				.msg-map{
					margin-right: 16rpx;
					border-radius: 20px 0rpx 20rpx 20rpx;
				}
				.voice{
					text-align: left;
				}
				.voice-img{
					float: right;	
					transform: rotate(180deg); //旋轉 重要
					width: 28rpx;
					padding-bottom: 4rpx; //因為旋轉了 變padding bottom
					height: 36rpx;
				}
			}
		}
	}
	.apple{
	/*	 position: fixed;
		  width: 100%;
		  left: 0;
		  bottom: 0;*/
		  height:flex;///*****************************************************
		   position: fixed; left: 0;   right:0; bottom: -50rpx;
			 z-index: 1001;
		
	}
</style>
