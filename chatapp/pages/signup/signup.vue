<template>
	<view>
		<view class= "top-bar">
			<view class="top-bar-left" @tap="toSignIn">
				<image src="../../static/images/common/arrow.png" class="back-img"></image>
		    </view>
		</view>
		<view class = "logo">
			<image src="../../static/images/img/panda.png"></image>
		</view>
		<view class = "main">
			<view class = "title"><b>註冊</b></view>
			
			<view class = "inputs">
				<view class="inputs-div">
					<view v-if="useremploy" class="employ">已占用</view>
					<!-- 用blur 而不用input原因: input每次輸入都會觸發，會導致和後端及資料庫的更新太頻繁 -->
					
					<input type = "text" @blur="isName" class="user" placeholder="請取個名字" placeholder-style="color:#aaa; font-weight:400" />
					
					<image v-if="isuser"  class="ok" src="../../static/images/sign/check.png"></image>
				</view>
				<view class="inputs-div">
					<input type = "text" @blur="isEmail" class="email" placeholder="請輸入信箱" placeholder-style="color:#aaa; font-weight:400" />
				    <view v-if="emailemploy" class="employ">已占用</view>
					<view v-if="invalid" class="invalid">信箱無效</view>
					<image v-if="isemail" class="ok" src="../../static/images/sign/check.png"></image>
				</view>
				<view class="inputs-div">
					<input :type = "type" @input="getpsw" class="psw" placeholder="請輸入密碼" placeholder-style="color:#aaa; font-weight:400"/>
					
					<image @tap="looks" class="look" :src="lookurl"></image>
					 
				
				</view>
				</view>
		
		</view>
		<view @tap="signUp" :class="[{submit:isok},{submit1:!isok}]" ><b>註冊</b></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'password',
				isuser: false,
				isemail: false,
				look:false,
				invalid: false,
				useremploy:false,
				emailemploy:false,
				lookurl:"../../static/images/sign/close.png",
				email:'',
				isok: false,
				user:'',
				psw:'',
				
			}
		},
		computed:{
			isOk: function(){
				let that =this;
				if(that.isuser && that.isemail && that.psw.length>5){
					that.isok=true;
				}else{
					that.isok=false;
				}
				return that.isok;
			},
		},
		methods: {
			looks: function(){
				if(this.look){
					this.type="password";
					this.look=!this.look;
					this.lookurl="../../static/images/sign/close.png";
				}else{
					this.type="text";
					this.look=!this.look;
					this.lookurl="../../static/images/sign/eye.png";
				}
			
			},
			//判斷是否為信箱格式
			isEmail: function(e){
				this.isOk;
				let reg = /^[0-9a-zA-Z_\.-]+[@][0-9a-zA-Z_\.-]+([\.][a-zA-Z]+){1,2}$/;
				this.email= e.detail.value;
				if(e.detail.value!=""){
					if(reg.test(this.email)){
						this.invalid=false;
						//this.isemail=true;
						this.matchMail();
					}else{
						this.invalid=true;
						this.isemail=false;
						this.emailemploy=false;
						this.isOk;
						//this.isemail=false;
					}
				}else{
					this.invalid=false;
					this.isemail=false;
					this.emailemploy=false;
					this.isOk;
				}
			},
			
			matchMail: function(e){
				//this.email=e.detail.value;
					uni.request({
						url:this.serverUrl+'/signup/judge',
						data:{
							data:this.email,
							type:'email',
						},
						method: 'POST',
						success:(data)=>{
							console.log(data);
							let status = data.data.status;
							if(status==200){//訪問後端成功
								let res =data.data.result;
								if(res>0){//表示信箱已被註冊過
									this.emailemploy=true;
									this.isemail=false;
								}else{//沒被註冊過
									this.emailemploy=false;
									this.isemail=true;
								}
								this.isOk;
							}else if(status==500){
								uni.showToast({
									title:'伺服器出錯!!',
									icon:'none',
									duration:1500,
								});
							}
						}
					})
				//	this.isuser=true;
					//this.user=e.detail.value;
				//	console.log(e);

			},
			
			
			isName: function(e){
				this.user=e.detail.value;
				
				if(e.detail.value!=""){	
					uni.request({
						url:this.serverUrl+'/signup/judge',
						data:{
							data:this.user,
							type:'name',
						},
						method: 'POST',
						success:(data)=>{
							console.log(data);
							let status = data.data.status;
							if(status==200){//訪問後端成功
								let res =data.data.result;
								if(res>0){//表示用戶名已被註冊過
									this.useremploy=true;
									this.isuser=false;
								}else{//沒被註冊過
									this.useremploy=false;
									this.isuser=true;
								}
								this.isOk;
							}else if(status==500){
								uni.showToast({
									title:'伺服器出錯!!',
									icon:'none',
									duration:1500,
								});
							}
						}
					})
				//	this.isuser=true;
					//this.user=e.detail.value;
				//	console.log(e);
				
				}else{
					this.isuser=false;
					this.useremploy=false;
					this.isOk;
				}
			},
			getpsw:function(e){
				this.psw = e.detail.value;
				this.isOk;
			},
			/*isOk: function(){	 
				if(this.isuser && this.isemail && this.psw.length>5){
					this.isok=true;
				}else{
					this.isok=false;
				}
			},*/
			toSignIn: function(){
				uni.navigateBack({delta:1, });  //返回一層
			},
			//提交註冊
			signUp: function(){
				if(this.isOk){
					uni.request({
						url:this.serverUrl+'/signup/add',
						data:{
							name:this.user,
							mail:this.email,
							pwd:this.psw,
						},
						method: 'POST',
						success:(data)=>{
							console.log(data);
							let status = data.data.status;
							if(status==200){
								//註冊成功  跳轉到登入頁
								uni.navigateTo({
									url:'../signin/signin?user='+this.user,
								})
							}else if(status==500){
								uni.showToast({
									title:'伺服器出錯!!',
									icon:'none',
									duration:1500,
								});
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	
	@import  "../../commons/css/mycss.scss";
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
 
		.top-bar-left{
		 float:left;
		 padding-left: 32rpx ;
		 //background-color:#eee ;
		 width: 88rpx;
		 height: 808rpx ;
			.text{
			 font-size: $uni-font-size-lg;
			 font-weight:  500;
			 color:  $uni-text-color;
			 line-height: 88rpx;		 
			 }
			 .back-img{
			 margin-top: 21rpx;
			 width: 46rpx;
			 height: 46rpx;
			} 
	  } 

	} */
	page {
	background-color: #f7f5e3;
	}
	.logo {
		 
		text-align: center;

		image {
		 
			 padding-top: 200rpx;
			 width: 200rpx;
			 height: 200rpx;
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
			.inputs-div{
				position: relative;
				//這裡有個關鍵的操作
				//要在父標籤(inputs-div)用相對定位，在子標籤(employ)用絕對定位
				//原因: 如果沒將父標籤定位，子標籤的絕對定位將會是整個視窗的絕對位置
				//如果父標籤定位，子標籤的絕對定位，就是依據父標籤的座標去絕對定位
				//需要定位的原因是，這裡"已佔用"文字框會跑掉，只好重新手動定位
				.employ,.invalid{
					//float: bottom;
					position: absolute;
					right: 0;
					top: 40rpx;
					float: right;
					font-size: $uni-font-size-base;
					font-weight: 500;
					color: $uni-color-warning;
					line-height: 88rpx;
				}
 
				.ok{
					position: absolute;
					right: 0;
					top: 76rpx;
					width:38rpx;
					height: 30rpx;
					
				}
				.look{
					
						position: absolute;
						right: 0;
						top: 76rpx;
						width: 52rpx;
						height: 42rpx;
				}
			}
				
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
	.submit1{
		position:relative;
		padding: 1px;
		 
		top:88rpx;
		margin:  0 auto;
		width:  520rpx;
		height: 96rpx;
		background-color:rgba(39, 40, 50, 0.2);
		border-radius: 48rpx;
		font-size: $uni-font-size-lg;
		font-weight: 800;
		color: $uni-text-color-inverse;
		line-height: 96rpx;
		text-align: center;
	}
</style>

