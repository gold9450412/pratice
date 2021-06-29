<template>
	<view>
		<view class= "top-bar">
			<view class="top-bar-left" @tap="toSignIn">
				<image src="../../static/images/common/arrow.png" class="back-img"></image>
		    </view>
			<view class="top-bar-right">
				<view class="more-img" v-if="relation == 0 || relation == 1" @tap="userDetail">
					<image src="../../static/images/userhome/more.png"></image>
				</view>	
			</view>
		</view>
		<view class="bg">
			<view class="bg-bai" :animation="animationData4"></view>
			<image :src="user.imgurl" class="bg-img" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :style="{background:sexBg}" :animation="animationData3">
					<image :src="seximg"></image>
				</view>
			<image :src="user.imgurl" mode="aspectFill" class="user-img" :animation="animationData2" :style="{borderRadius:bigsmall}"></image>
			</view>
			<view class="user-imf">
				<view class="name">{{user.name}}</view>
				<view class="nick">暱稱: {{markname}}</view>
				<view class="intr">{{user.explain}}</view>
			</view>
		</view>
		<view class="buttom-bar">
			<view class="bottom-btn btn1"  @tap="addFriendBtn" v-if="relation == 2">加為好友</view>
			<view class="bottom-btn btn1"  @tap="addFriendAnimat" v-if="relation == 1">發送訊息</view>
		</view>
		<view class="add-misg" :style="{height:addHeight+'px' ,bottom:-+addHeight+'px'}" :animation="animationData">
			<view class="name">{{user.name}}</view>
			<textarea v-model="msg" maxlength="120" class="add-main"></textarea>
		</view>
		<view class="add-bt buttom-bar" :animation="animationData1" >
			<view class="close btn1" @tap="addFriendAnimat">取消</view>
			<view class="send btn1" @tap="addSubmit">發送</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id :'', //用戶對象id = fid
				uid:'', //自己的id
				token:'',
				user:{},
				msg:'',
				markname:'',
				seximg:'../../static/images/userhome/genderless.png', //性別
				sexBg: 'rgba(151, 153, 151, 1.0)',
				relation:'',	//用戶關係 (判斷好友用) 0表示自己 1表示好友 2表示非好友
				addHeight:'',
				animationData:{},
				animationData1:{},
				animationData2:{},
				animationData3:{},
				animationData4:{},
				isAdd:false,
				bigsmall:'48rpx',
				myname: '冬雨',
			/*	user:{
					name:'春風',
					nick:'哈利',
					intr:'驀然回首，我仍在原地等妳。雨紛紛，那天回程的雨，下的是幸福與感謝。',
				}*/
				
			};
		},
		onLoad :function(e){
			this.id = e.id;
			this.getStorages();
			this.getUser();
			this.judgeFriend();
		},
		onReady: function(){
			this.getElementStyle();
		},
		onShow :function() { //從userdetail返回上層的刷新
			this.getMarkname();
			this.getUser();
		},	
		methods:{
			//獲取緩存
			getStorages: function(){
				try{
					const value = uni.getStorageSync('user');
					if(value){
						console.log(value);
						this.uid = value.id;
						//this.imgurl = this.serverUrl+'/user/'+value.imgurl;
						this.token = value.token;
						this.myname = value.name;
					}else{
						//如果不存在緩存，跳回登入頁面
						uni.navigateTo({
							url:'../signin/signin',
						})
					}
				}catch(e){
					
				}
			},
			//獲取用戶訊息
			getUser: function(){
				uni.request({
					url:this.serverUrl+'/user/detail',
					data:{
						id:this.id,
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						console.log(data);
						let status = data.data.status;
						if(status==200){//訪問後端成功
							let res =data.data.result;
							res.imgurl = this.serverUrl+'/'+res.imgurl;
							console.log(res.explain);
							//處理簡介
							if(res.explain==undefined){
								res.explain = '這人什麼都沒有留下';
							}
							if(this.markname.length==0){ //沒有markname 則用name代替
								this.markname = res.name;
							}
							this.sexJudge(res.sex);
							this.user=res;
							//console.log(res.sex);
						}else if(status==500){
							uni.showToast({
								title:'伺服器出錯!!',
								icon:'none',
								duration:1500,
							});
						}else if(status==300){//token過期 跳回登入頁面
								uni.navigateTo({
									url:'../signin/signin?cgpwd='+this.myname,
								});
							 
						}
					}
				})
			},
			//性別判斷
			sexJudge: function(e){
				if(e == 'female'){
					this.seximg = '../../static/images/userhome/woman.png';
					this.sexBg = 'rgba(255,93,91,1)';
				}else if(e == 'male'){
					this.seximg = '../../static/images/userhome/male.png';
					this.sexBg = 'rgba(87,153,255,1)';
				}else{
					this.seximg = '../../static/images/userhome/genderless.png';
					this.sexBg = 'rgba(151, 153, 151, 1.0)';
				}
			},
			//判斷用戶關係 是否為好友了
			judgeFriend: function(){
				if(this.id == this.uid){
					this.relation = 0; //我自己
				}else{
					//如果不是自己 進行好友驗證
					uni.request({
						url:this.serverUrl+'/search/isfriend',
						data:{
							uid: this.uid,
							fid: this.id,
							token:this.token,
						},
						method: 'POST',
						success:(data)=>{
							//console.log(data);
							let status = data.data.status;
							if(status==200){//訪問後端成功
								this.relation = 1;
								this.getMarkname(); //沒有markname時 默認輸出id
								//console.log("好友:"+this.relation);
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
				}
				//這裡都是異步所以console.log("好友:"+this.relation);只能分開放， 同步可以讓console.log("好友:"+this.relation);放這裡
			},
			//獲取好友暱稱
			getMarkname: function(){
				uni.request({
					url:this.serverUrl+'/user/getmarkname',
					data:{
						uid: this.uid,
						fid: this.id,
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						//console.log(data);
						let status = data.data.status;
						if(status==200){//訪問後端成功
							let res = data.data.result;
 
							if(res.markname){
								this.markname = res.markname; //如果存在
							}
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
			toSignIn: function(){
				uni.navigateBack({delta:1, });  //返回一層
			},
			
			getElementStyle: function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data=>{
					//console.log("得到布局位置訊息"+JSON.stringify(data));
					//console.log("得到離頁面頂部的距離為"+data.top);
					this.addHeight=data.height-186;
				}).exec();
			},
			addFriendAnimat: function(){
				this.isAdd=!this.isAdd;
				var animation = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				});
				var animation1 = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				});
				var animation2 = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				});
				var animation3 = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				});
				var animation4 = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				});
				if(this.isAdd){
				animation.bottom(0).step();
				animation1.bottom(0).step();
				animation2.width(120).height(120).top(40).left(-100).step();
				animation3.opacity(0).step();
				animation4.backgroundColor('rgba(255,228,49,1)').step();
				this.bigsmall='50%';
				}
				else{
				animation.bottom(-this.addHeight).step();
				animation1.bottom(-100).step();
				animation2.width().height().top(0).left(0).step();
				animation3.opacity(1).step();
				animation4.backgroundColor('rgba(255,228,49,0)').step();
				this.bigsmall='48rpx';
				}
				this.animationData=animation.export();
				this.animationData1=animation1.export();
				this.animationData2=animation2.export();
				this.animationData3=animation3.export();
				this.animationData4=animation4.export();
			},
			addFriendBtn :function(fid){
				this.fid=fid;
				this.msg=this.myname+'請求添加好友!!',
				this.addFriendAnimat();
			},
			//確定添加好友
			addSubmit: function(){
				if(this.msg.length>0){
					this.addFriendAnimat();
					uni.request({
						url:this.serverUrl+'/friend/applyfriend',
						data:{
							uid: this.uid,
							fid: this.id,
							token:this.token,
							msg: this.msg,
						},
						method: 'POST',
						success:(data)=>{
							let status = data.data.status;
							console.log(status);
							if(status==200){//是好友
								uni.showToast({
									title:'好友請求發送成功!!',
									icon:'none',
									duration:1500,
								});				
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
				}
			},
			userDetail:function(){ //跳轉用戶詳情
				uni.navigateTo({
					url:'../userdetails/userdetails?id='+this.id,
				});
			}
		}
	}
</script>

<style lang="scss">
@import "../../commons/css/mycss.scss";
	.bg{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.bg-bai{
		width: 100%;
		height: 100%;
		//background-color: #eee;
		z-index: 50;
		}
		.bg-img{
			z-index: -10;
			position:  absolute;
			opacity: 0.7;
			left: -10rpx;
			top:  -10rpx;
			width: 110%;
			height: 110%;
			filter: blur(16px); //模糊化
		}
	}
	.main{
		text-align: center;
		padding-top: 148rpx;
		.user-header{
			margin:  0 auto;
			width: 400rpx;
			height: 400rpx;
			//border: 1px solid red;
			position: relative;
			.sex{
				position: absolute;
				z-index: 10;
				bottom: 22rpx;
				right: 22rpx;
				width:  64rpx;
				height: 64rpx;
				z-index: 12;
				//background:  rgba(255,93,91,1);
				border-radius:  $uni-border-radius-circle;
				image{
					padding:  16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}
			.user-img{
				top: 0;
				z-index: 10;
				width: 400rpx;
				height: 400rpx;
			//	border-radius: 48rpx;
				background-color: #eee;
				border: 6rpx solid rgba(255,255,255,1);
				box-shadow: 0px 36rpx 40rpx 0rpx rgba(39,40,50,0.1);
			}
		}
		.user-imf{
			
			padding: 42rpx;
			.name{
				font-size: 52rpx;
				color: $uni-text-color;
				line-height: 74rpx;
			}
			.nick{
				font-size: $uni-font-size-base;
				line-height: 40rpx;
				color: $uni-text-color;
			}
			.intr{
				z-index: 1050;
				padding: 20rpx 100rpx;
				font-size: $uni-font-size-base;
				font-weight: 5000;
				color: $uni-text-color;
				 
				line-height: 48rpx;
			}
		}

	} 
	.buttom-bar{
		.bottom-btn{
			background: $uni-color-primary;
			margin: 0 $uni-spacing-col-base;
		}
	}
	.add-misg{
		position: fixed;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
		padding: 0 56rpx;
		//height: 1252rpx;
		background: rgba(255,255,255,1);
		border-radius: 40rpx 40rpx 0px 0px;
		.name{
			 
			padding: 168rpx 0 48rpx;
			font-size: 52rpx;
			color: $uni-text-color;
			line-height: 74rpx;
		}
		.add-main{
			padding: 18rpx 22rpx;
			box-sizing: border-box;
			width: 93%;
			
			height: 420rpx;
			background: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}
	}
	.add-bt{
		//position: fixed;
		bottom: -200rpx;
		//width: 100%;
		//height: 104rpx;
		//box-sizing: border-box;
		//padding:  12rpx $uni-spacing-col-base;
	//	height: 104rpx;
		z-index: 10;
		display:  flex;
		.close{
			//flex:0;
			width: 172rpx;
			//text-align: center;
			//line-height: 80rpx;
			//font-size: $uni-font-size-lg;
			//color: $uni-text-color;
			//height: 80rpx;
			background: $uni-bg-color-hover;
			//border-radius: $uni-border-radius-sm;
			margin-left:  $uni-spacing-col-base;
		}
		.send{
			margin-left: $uni-spacing-col-base;//外元件  padding為內元件 
			margin-right: $uni-spacing-col-base;
			flex: auto;
			//text-align: center;
			//line-height: 80rpx;
			//font-size: $uni-font-size-lg;
			//color: $uni-text-color;			
			//height: 80rpx;
			background: $uni-color-primary;
			//border-radius: $uni-border-radius-sm;
		}
	}
</style>
