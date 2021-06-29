<template >
	<view >
		<view class= "top-bar">
			<view class="top-bar-right" @tap="toSignUp()">
				<view class="text"> 註冊 </view>
		    </view>
	</view>
		<view class = "logo">
			<image src="../../static/images/img/ducky.png" @tap="login1"></image>
		</view>
		<view class = "main">
			<view class = "title"><b>登入</b></view>
			<view class = "slogan">您好，歡迎來到ChatApp </view>
			<view class = "inputs">
				<input type = "text" v-model="user"  class="user" placeholder="帳號/信箱" placeholder-style="color:#aaa; font-weight:400" />
				<input type = "password" v-model="psw" clses="psw" placeholder="密碼" placeholder-style="color:#aaa; font-weight:400"/>
			</view>
			<view class="tip" :style="{display:mon}"> 輸入帳號密碼錯誤!</view>
		</view>
		<view class="submit" @tap="login"><b>確定</b></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:"",
				psw:"",
				token:'',
				mon :'none',
			}
		},
		onLoad:function(e){
			if(e.user){
				this.user=e.user;
				uni.showToast({
					title:'註冊成功!!',
					icon:'none',
					duration:1500,
				});
			}else if(e.name){
				this.user=e.name;
					uni.showToast({
						title:'登入過期，請重新登入!!',
						icon:'none',
						duration:1500,
					});
			}else if(e.cgpwd){
				this.user=e.cgpwd;
				uni.showToast({
					title:'登入過期，請重新登入!!',
					icon:'none',
					duration:2500,
				});
			}
		},
		methods: {
			toSignUp: function(){
				uni.navigateTo({url: '../signup/signup',});
			},
			
			getUser: function(e){
				this.user=e.detail.value;
			},
			getPsw: function(e){
				this.psw=e.detail.value;
			},
			
			login : function(){
				uni.request({
					url:this.serverUrl+'/signin/match',
					data:{
						data: this.user,
						pwd: this.psw,
					},
					method: 'POST',
					success:(data)=>{
						let status = data.data.status;
						 
						if(status==200){
							this.mon = 'none';
							//匹配成功 儲存用戶訊息 使用異步或同步儲存 到其他頁面時也使用該登入資訊
							let res = data.data.back;
							try{ 
								uni.setStorageSync('user',{'id': res.id,'name':res.name,'imgurl':res.imgurl,'token':res.token});
							} catch(e){//error
								console.log("數據儲存失敗");
							}
							uni.navigateTo({
								url:'../index/index',
							
							})
								//下面是要取數據時的用法
							// try{
							// 	const value = uni.getStorageSync('user');
							// 	if(value){
							// 		console.log(value);
							// 	}
							// }catch(e){
								
							// }
						}else if(status==400){
							//匹配失敗
							this.mon = 'block';
							this.psw='';
						}else if(status==500){
							//伺服器失敗
							uni.showToast({
								title:'伺服器出錯!!',
								icon:'none',
								duration:1500,
							});
						}
					}
				})
			},
			
			login1: function(){
				//訪問後端js
				/*uni.request({
					url:'http://127.0.0.1:3002/test',
					data:{
						
					},
					method:'GET',
					success:(data)=>{
						console.log(data); //這裡是test頁面
					}  //訪問完 傳回(data)
				});*/
				uni.request({
					//url:'http://127.0.0.1:3002/mail',
					//url:'http://127.0.0.1:3002/signup/add',
					//url:'http://127.0.0.1:3002/search/user',
					//url:'http://127.0.0.1:3002/signin/test',
					//url:'http://127.0.0.1:3002/signin/match',
					//url:'http://127.0.0.1:3002/user/update',
					//url:'http://127.0.0.1:3002/friend/applyfriend',
					//url:'http://127.0.0.1:3002/user/detail',
					//url:'http://127.0.0.1:3002/friend/updatefriendstate',
					//url:'http://127.0.0.1:3002/friend/deletefriend',
					//url:'http://127.0.0.1:3002/index/getfriend',
					//url:'http://127.0.0.1:3002/index/unreadmsg',
					//url:'http://127.0.0.1:3002/index/updatemsg',
					//url:this.serverUrl+'/search/isfriend',
					url:'http://127.0.0.1:3002/chat/msg',
					data:{
					/*	mail:'gold94504123@gmail.com',
						name:'柯柯4',
						pwd:'123456783',*/
						//data:'柯柯3',
						//id:'60c642bdbd15fc4894d11d1a',
						//data:'柯柯王',
						//data:'gold9450413@gmail.com',
						//type:'email', //修改的是name
						//data:'123456783',
						//pwd:'987654',
						//pwd:'123456783',
						//token : this.token,
						//uid :'60c63c27bd15fc4894d11d19', 第一個
						//fid :'60c642bdbd15fc4894d11d1a',
						//msg:'口以當個朋友ㄇ2',
						//data:'gold9450413@gmail.com',
						//pwd:'123456783',
						//uid :'60ccda3229cdce43a006709c',
						//fid :'60ccda4429cdce43a006709d',
						uid :'60d32f9d84f5631e3c36d03a',
						fid :'60d2c9268adce93d443aa853',
						//token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDJjOTI2OGFkY2U5M2Q0NDNhYTg1MyIsInRpbWUiOiIyMDIxLTA2LTIzVDA1OjQwOjE0Ljk3OFoiLCJpYXQiOjE2MjQ0MjY4MTQsImV4cCI6MTYzNDc5NDgxNH0.k5TjjyxGfMh1s9X-qRAvydEd3wqKLmfgR45vqXKqM10',
						//state:2,
					    //msg : '+啦',
					},
					method:'POST',
					success:(data)=>{
						 console.log(data); //這裡是test頁面
						//this.token=data.data.back.token;
						//console.log(this.token);
					}  //訪問完 傳回(data)
				});
				if(this.user && this.psw){
					console.log('提交');
				}
			},
			login2: function(){
				//訪問後端js
				/*uni.request({
					url:'http://127.0.0.1:3002/test',
					data:{
						
					},
					method:'GET',
					success:(data)=>{
						console.log(data); //這裡是test頁面
					}  //訪問完 傳回(data)
				});*/
				uni.request({
					//url:'http://127.0.0.1:3002/mail',
					//url:'http://127.0.0.1:3002/signup/add',
					url:'http://127.0.0.1:3002/signin/test2',
					data:{
						token : this.token ,
					},
					method:'POST',
					success:(data)=>{
						console.log(data); //這裡是test頁面
					 
					 
					}  //訪問完 傳回(data)
				});
				if(this.user && this.psw){
					console.log('提交');
				}
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
		padding-top: var(--status-bar-height);
	} */
/* 	.top-bar {
		z-index: 1001;
		position: fixed;
		top:0;
		left: 0;
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		background:$uni-bg-color;
 
		.top-bar-right{
		float:right;
		 padding-right: 32rpx ;
			.text{
			
			 font-size: $uni-font-size-lg;
			 font-weight:  500;
			 color:  $uni-text-color;
			 line-height: 88rpx;		 
		} 
	  } 

	} */
	page {
	background-color: #f7f5e3;
	}
	.logo {
		 
		text-align: center;

		image {
			 padding-top: 256rpx;
			 width: 194rpx;
			 height: 194rpx;
			 margin: 0 auto;
			 }
	}	
	.main{
		padding: 54rpx $uni-spacing-row-lg;
		//width:  100%;
		.title{
			font-size: 56rpx;
			font-weight: 500;
			color : $uni-text-color;
			line-height: 80rpx;
		}
		.slogan{
			font-size: 40rpx;
			color: $uni-text-color-grey;
			line-height: 56rpx;
		}
		.inputs{
			padding-top: 48rpx;
			input{
				padding-top: 40rpx;
				height: 88rpx;
				font-size: $uni-font-size-lg;
				font-weight: 500;				color: $uni-text-color;
				line-height: 88rpx;
				border-bottom: 1px solid $uni-border-color;		
			}
				
		}
		.tip{
			float: left;
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 56rpx;
		}
	}
	.submit{
		position:relative;
		padding: 1px;
		 
		top:88rpx;
		margin:  0 auto;
		width:  520rpx;
		height: 96rpx;
		background-color: $uni-color-primary;
		box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(255,228,49,0.4);
		border-radius: 48rpx;
		font-size: $uni-font-size-lg;
		font-weight: 800;
		color: $uni-text-color;
		line-height: 96rpx;
		text-align: center;
	}
</style>

