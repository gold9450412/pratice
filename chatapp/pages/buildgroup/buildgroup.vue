<template>
	<view class= "content">
		<view class= "top-bar">
			<view class="top-bar-left" @tap="backOne">
				<view class="text" @tap="back">取消</view>
			</view>
			<view class="top-bar-center">
				<view class="title">創建群組</view>
				
				</view>
			<view class="top-bar-right pice"></view>
		</view>
		<view class="main">
			<!---這個top是為了跟用戶切割版面  用戶必須用滾輪-->
			<view class="top">
			<!---群頭像-->
			<view class="group-img">
				<image-cropper class="cropper" :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
				<image src="../../static/images/group/edit.png"  class="pan" @tap="upload"></image>
				<image :src="cropFilePath" class="img"  @tap="upload"></image>
			</view>
			<!---群名-->
			<view class="group-name">
				<input class="group-name-input" type="text" placeholder="幫群組取個名字" placeholder-style="color:#aaa; font-weight:400" v-model="name"/>
			</view> 
			 <view class="title">用戶</view>
			</view>
			
			<!---選擇用戶-->
			<view class="friends">	
				<view class="user" v-for="(item,index) in friends" :key="index" >
					<view class="selected" :class="{isselected:item.selected}" @tap="selectFriend(index)">
						<image src="../../static/images/group/tick-sign.png" v-if="item.selected" class="selected-img"></image>
					</view>
					<image class="user-img" :src="item.imgurl"></image>
					<view class="name">{{item.name}}</view>
				</view>
			</view>
		</view>
		
		<view class="buttom-bar">
			<view @tap="submit" class="bottom-btn btn1" :class="{noselect:selectedNumber>0&&name.length>0}">創建({{selectedNumber}})</view>
		</view>
	</view>
</template>

<script>
	//html雙class用法
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		data() {
			return {
				tempFilePath:'',
				cropFilePath: '../../static/images/group/group.png',
				heading:'',
				selectedNumber:0,
				/* user:[
					{
						selected:false,
						imgurl:'../../static/images/img/panda.png',
						name:'小胖2',
					},
					{
						selected:true,
						imgurl:'../../static/images/img/panda.png',
						name:'中胖',
					},
					{
						selected:true,
						imgurl:'../../static/images/img/panda.png',
						name:'大胖',
					},
					{
						selected:false,
						imgurl:'../../static/images/img/panda.png',
						name:'迷你胖',
					},
					{
						selected:false,
						imgurl:'../../static/images/img/panda.png',
						name:'無敵無敵無敵無敵無敵胖胖胖胖',
					},
					{
						selected:false,
						imgurl:'../../static/images/img/panda.png',
						name:'小胖',
					},
					{
						selected:true,
						imgurl:'../../static/images/img/panda.png',
						name:'中胖',
					},
					{
						selected:true,
						imgurl:'../../static/images/img/panda.png',
						name:'大胖',
					},
					{
						selected:false,
						imgurl:'../../static/images/img/panda.png',
						name:'迷你胖',
					},
					{
						selected:false,
						imgurl:'../../static/images/img/panda.png',
						name:'無敵無敵無敵無敵無敵胖胖胖胖',
					},				{
						selected:false,
						imgurl:'../../static/images/img/panda.png',
						name:'小胖',
					},
					{
						selected:true,
						imgurl:'../../static/images/img/panda.png',
						name:'中胖',
					},
					{
						selected:true,
						imgurl:'../../static/images/img/panda.png',
						name:'大胖',
					},
					{
						selected:false,
						imgurl:'../../static/images/img/panda.png',
						name:'迷你胖',
					},
					{
						selected:false,
						imgurl:'../../static/images/img/panda.png',
						name:'敵無敵無敵無敵無敵胖胖胖胖5',
					},
				], */
				
				aa:false,
				name:'',
				uid:'',
				token:'',
				gimgurl:'/group/group.png',
				friends:[], //好友列表
				user:[], //已點選的好友id
			};
		},
		components: {ImageCropper},
		onLoad:function(){
			this.getStorages();
			this.getFriends();
			this.selectNumber();
		},
		computed:{
			//是否選擇好友
			selec:function(){
				if(this.selectedNumber>0){
					return true;
				}else{
					return false;
				}
			}
		},
		methods:{
			//獲取緩存
			getStorages: function(){
				try{
					const value = uni.getStorageSync('user');
					if(value){
						console.log(value);
						this.uid = value.id;
						this.token = value.token;
					}else{
						//如果不存在緩存，跳回登入頁面
						uni.navigateTo({
							url:'../signin/signin',
						})
					}
				}catch(e){
					
				}
			},
			//獲取好友名單
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
						//this.refresh = true;	
						let status = data.data.status;				 
						if(status==200){//訪問後端成功
							let res= data.data.result;
							if(res.length>0){
							//this.noone = false;
							for(let i=0; i<res.length;i++){
								res[i].selected = false;
								res[i].imgurl=this.serverUrl+'/'+res[i].imgurl;		
								if(res[i].markname){
									res[i].name = res[i].markname;
								}
								//這裡還要拼接群組數組  所以不能用等於 要用push 一個一個接上去
								this.friends.push(res[i]);	
								}					
								console.log(this.friends);
								 
							}else{
								//this.noone = true;
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
			},
			back:function(){
				uni.navigateBack({
					delta:1
				});
			},
			upload() {
			    uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album','camera'], //从相册选择
				success: (res) => {
					this.tempFilePath = res.tempFilePaths.shift()
				}
			});
			},
			confirm(e) {
			  this.tempFilePath = "";
			  this.cropFilePath = e.detail.tempFilePath;
			  this.heading=e.detail.tempFilePath;
			 //console.log(e.detail.tempFilePath);
			 uni.uploadFile({
			   url:this.serverUrl+'/files/upload', //後端地址
			   filePath: this.cropFilePath,
			   name: "file",
			   fileType: "image",
			   formData:{
			 			'url':'group',
			 			'name': this.uid+new Date().getTime(), //一個人可以建很多群 所以不能只用uid 不然會覆蓋掉
			 			'token': this.token,
						
			 		}, 
			   success: (uploadFileRes) => {
			     var backstr = uploadFileRes.data;
			     //獲取頭像名稱
				 this.gimgurl = backstr;
 
			   },
			 
			   fail(e) {
			     console.log("this is errormes " + e.message);
			   },
			 });
			},
			confirm1(e) {
			  this.tempFilePath = "";
			  this.cropFilePath = e.detail.tempFilePath;
			  this.heading=e.detail.tempFilePath;
			 //console.log(e.detail.tempFilePath);
			},
			selectNumber:function(){
				for(let i=0;i<this.friends.length;i++){
					if(this.friends[i].selected){
						this.selectedNumber++;
					}
				}
			},
			selectFriend: function(e){
				if(this.friends[e].selected){
					this.friends[e].selected=false;
					this.selectedNumber--;
				}else{
					this.friends[e].selected=true;
					this.selectedNumber++;
				}
				
			},
			//創建提交
			submit: function(){
				if(this.selectedNumber>0&&this.name.length>0){
					 for(let i=0;i<this.friends.length;i++){
						 if(this.friends[i].selected){
							 this.user.push(this.friends[i].id);
						 }
					 }
					 this.user.push(this.uid);
					uni.request({
						url:this.serverUrl+'/group/creategroup',
						data:{
							uid: this.uid,
							token:this.token,
							name: this.name,
							imgurl: this.gimgurl,
							user: this.user,
						},
						method: 'POST',
						success:(data)=>{
							//this.refresh = true;	
							let status = data.data.status;				 
							if(status==200){//訪問後端成功
								let res= data.data ;
								uni.navigateTo({
									url: '../index/index',
								})
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
		},
	}
</script>

<style lang="scss">
@import "../../commons/css/mycss.scss";
	.top-bar{
		background: rgba(255,255,255,1);
		border-bottom: 2px solid $uni-border-color;
		 z-index: 30;
	}
	.main{
		
		display: flex;
		flex-direction:  column;
	.top{	  
		padding-top: 80rpx;//拉空間 不然裁剪圖片確定取消會被遮住
		margin-top: 68rpx;//拉空間 不然裁剪圖片確定取消會被遮住
		position: fixed;
		left: 0;
		background-color: #fff;
		width: 100%;
		z-index: 40;
	}
	.group-img{
		
		     z-index: 9999999999;
			margin: 0 auto;
			width: 196rpx;
			height: 196rpx;
			background: $uni-color-primary;
			box-shadow: 0rpx 36rpx 40rpx 0rpx rgba(39,40,50,0.1);
			border-radius: 40rpx;
			overflow: hidden;
			position: relative;
			.img{z-index: 9999999999;
				width: 196rpx;
				height: 196rpx;
			}
			.pan{
				position: absolute;
				z-index: 9999999999;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				width: 56rpx;
				height: 56rpx;
			}
			.cropper{
				z-index: 999999999;
			}
		}
	.group-name{
			padding: 62rpx $uni-spacing-col-base 0;
	.group-name-input{
			text-align: center;
			width: 686rpx;
			height: 95rpx;
			background: $uni-bg-color-grey ;
			border-radius: 46rpx;
			font-size: 32rpx;
			color: $uni-text-color;
			}
	}
	.title{
		padding: $uni-spacing-row-base $uni-spacing-col-base 20rpx;
		font-size: 44rpx;
		font-weight: 600;
		color: $uni-text-color;
		line-height: 60rpx;
	}
	.friends{
		position: fixed;
		left: 0;
		padding: 600rpx $uni-spacing-row-base 100rpx;//把上面的擠下來 它的位置和top重疊
		.title{
			font-size: 44rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 60rpx;
		}
		.user{
			
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 120rpx;
			.selected{
				flex: none;
				margin-right: 30rpx;
				width: 48rpx;
				height: 48rpx;
				background: rgba(255,228,49,0.5);
				border-radius: 24rpx;
				position: relative;
				.selected-img{
					width: 30rpx;
					height: 30rpx;
					position: absolute;
					left: 8rpx;
					top: 8rpx;
				}

			}
			.isselected{
				background: rgba(255,228,49,1);
			}
			.user-img{
				
				width: 80rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
			}
			.name{
				padding-left: 32rpx;
				font-size: 36rpx;
				color: $uni-text-color;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				}
			}
		}
	}
	.buttom-bar{
		background: rgba(250,250,250,0.9);
		box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.25);
		.bottom-btn{
			background: $uni-bg-color-grey;
			margin: 0 $uni-spacing-col-base;
		}
		.noselect{	
			background: $uni-color-primary;
		}
	}
</style>
