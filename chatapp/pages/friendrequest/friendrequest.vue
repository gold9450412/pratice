<template>
	<view class="content">
		<view class= "top-bar">
			<view class="top-bar-left" @tap="toSignIn">
				<image src="../../static/images/common/arrow.png" class="back-img"></image>
		    </view>
			<view class="top-bar-center">
				<view class="title">好友請求</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="requester" v-for="(item,index) in requesters" :key="item.id">
				<view class="request-top">
					<view class="reject btn" @tap="refuse(item.id)">拒絕</view>
					<view class="header-img">
						<image :src="item.imgurl" ></view>	
					<view class="agree btn" @tap="agree(item.id)">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{ChangeTime(item.lastTime)}}</view>
				</view>
			
				<view class="notice">
				<text>留言: </text>
				{{item.msg}}
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
				requesters:[],
				uid:'',
				myname:'',
				token:'',
			};
		},
		onLoad() {
			this.getStorages();
			//this.getRequsters();
			this.friendRequest();
	
		},
		methods:{
			getStorages: function(){
				try{
					const value = uni.getStorageSync('user');
					if(value){
						console.log(value);
						this.uid = value.id;
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
			toSignIn: function(){
				uni.navigateBack({delta:1, });  //返回一層
			},
			
			ChangeTime: function(date){
				return myfun.dateTime(date);
			},
			getRequsters: function(){
				this.requesters = datas.friends();
				for (let i=0 ; i<this.requesters.length;i++){
				this.requesters[i].imgurl = '../../static/images/img/'+ this.requesters[i].imgurl;
				console.log(this.requesters[i].imgurl);}
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
						let status = data.data.status;	 
						if(status==200){//訪問後端成功
							let res = data.data.result;
							for(let i=0; i<res.length;i++){
								res[i].imgurl=this.serverUrl+res[i].imgurl;
								console.log(res[i].imgurl);
								this.getLeave(res ,i);
							}
							this.requesters = res;
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
			//獲取留言
			getLeave: function(arr,i){
				uni.request({
					url:this.serverUrl+'/index/getlastmsg',
					data:{
						uid: this.uid,
						fid: arr[i].id,
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						let status = data.data.status;			 
						if(status==200){//訪問後端成功
							let res = data.data.result;
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
			//拒絕好友申請 (同刪除好友)
			refuse: function(fid){
				uni.request({
					url:this.serverUrl+'/friend/deletefriend',
					data:{
						uid: this.uid,
						fid: fid,
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						let status = data.data.status;			 
						if(status==200){//訪問後端成功
							for(let i = 0;i<this.requesters.length;i++){
								if(this.requesters[i].id == fid){
									this.requesters.splice(i,1);
								}
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
			//同意好友申請
			agree: function(fid){
				uni.request({
					url:this.serverUrl+'/friend/updatefriendstate',
					data:{
						uid: this.uid,
						fid: fid,
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						let status = data.data.status;			 
						if(status==200){//訪問後端成功
							for(let i = 0;i<this.requesters.length;i++){
								if(this.requesters[i].id == fid){
									this.requesters.splice(i,1);
								}
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
			
		},
	}
</script>

<style lang="scss">
@import "../../commons/css/mycss.scss";
.top-bar{
	background: rgba(255,255,255,0.96);
	border-bottom: 2px solid $uni-border-color;
}
.main{
	padding:108rpx $uni-spacing-row-base $uni-spacing-col-base;
	.requester{
		margin-top: 112rpx;
		padding:  $uni-spacing-col-base;
		background:rgba(255,255,255,1);
		box-shadow: 0px 24rpx 64rpx -8rpx rgba(0,0,0,0.1) ;
		border-radius: $uni-border-radius-base;
	}
	.request-top{
		
		display: flex;
		flex-direction: row;
		.btn{
			flex: none;
			text-align: center;
			width: 160rpx;
			height: 64rpx;
			background: rgba(255,93,91,0.1);
			border-radius: 40rpx;
			font-size: $uni-font-size-lg ;
			line-height: 64rpx;
		}
		.reject{
			color: $uni-color-warning;
			background-color: rgba(255,93,91,0.1);
		}
		.agree{
			color: $uni-text-color;
			background-color: $uni-color-primary;
		}
		.header-img{
			margin-top: -104rpx;
			flex: auto;
			text-align: center;
			image{
				width: 144rpx;
				height: 144rpx;
				border-radius: 50%;
				background-color: $uni-color-primary;
			}

		}
	}
	.request-center{
		text-align: center;
		padding-top:20rpx;
		padding-bottom: 40rpx;
		.title{
			font-size: 36rpx;
			font-weight: 500;
			color:$uni-text-color;
			line-height: 50rpx;
		}
		.time{
			font-size: $uni-font-size-sm;
			color:$uni-text-color-disable;
			line-height: 34rpx;
		}
	}
	.notice{
		padding: $uni-spacing-row-sm $uni-spacing-col-base;
		border-radius: $uni-border-radius-base;
		background-color: $uni-bg-color-grey;
		font-size: $uni-font-size-base;
		color:$uni-text-color;
		line-height: 40rpx;
	}
}
</style>
