<template>
	<view class="content">
		<view class= "top-bar">
			<view class="search-div">
				<image src="../../static/images/index/loupe.png" class="search-img"></image>
				<input type = "search" @input="search" class="search" placeholder="搜尋用戶/群" placeholder-style="color:#aaa; font-weight:400" />
			</view>
			<view class="top-bar-right">
				<view class="text" @tap="toIndex">取消</view>
				
			</view>
		</view>
		<view class= "main">
			<view class="result">
				<view class="title" v-if="userarr.length>0">用戶</view>
				<view class="list" v-for="(item ,index) in userarr" :key="item.id">
					<navigator  hover-class="none"  :url="'../userhome/userhome?id='+item._id">
						<image :src="item.imgurl"></image>
					</navigator>
					
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right-bt send" v-if="item.tip==1">發送</view>
					<view class="right-bt add" v-if="item.tip==0" @tap="addFriendBtn(item._id)">加好友</view>
				</view>
				<!--<view class="list">
					<image src="../../static/images/index/panda-bear.png"></image>
					<view class="names">
						<view class="name">小黃</view>
						<view class="email">apple@gamil.com</view>
					</view>
					<view class="right-bt add">加好友</view>
				</view> -->
			</view>
		</view>
		<!-- 添加好友 -->
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify()">取消</view>
				<view class="title">好友申請</view>
				<view class="define" @tap="addSubmit()">確定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="msg" class="modify-content" @input="modifyContent"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from "../../commons/js/datas.js";
	import myfun from "../../commons/js/myfun.js";
	export default {
		data() {
			return {
				userarr:[],
				uid:'',
				fid:'',
				token:'',
				myname:'',
				animationData:{},
				isModify:false,
				widHeight:'',
				msg:'',
			};
		},
		onLoad: function(){
			this.getStorages();
		},
		onReady:function(){
			this.getElementStyle();
		},
		methods:{
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
			//獲取函數關鍵詞  用debounce是為了延遲 避免每次打字 都要到後端取資料
			search:myfun.debounce(function(e){
				this.userarr=[];  //注意 每次都要清空 重新匹配
				let searchval = e.detail.value;
			//	console.log(searchval);
				if(searchval.length>0) //必加  不然0 (輸出中也算input，除非是英文) 就會列出14個
				{	
					this.searchUser(searchval);
				}
			},300),
			search1: function(e){
				this.userarr=[];  //注意 每次都要清空 重新匹配
				let searchval= e.detail.value;
				
				if(searchval.length>0) //必加  不然0 (輸出中也算input，除非是英文) 就會列出14個
				{	
					this.searchUser(searchval);
				}
			},
		/*	search : function(e){
				this.userarr=[];  //注意 每次都要清空 重新匹配
				let searchval= e.detail.value;
				
				if(searchval.length>0) //必加  不然0 (輸出中也算input，除非是英文) 就會列出14個
				{	
					this.searchUser(searchval);
				}
			},*/
			searchUser:function(e){
				uni.request({
					url:this.serverUrl+'/search/user',
					data:{
						data: e,
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						console.log(data);
						let status = data.data.status;
						if(status==200){//訪問後端成功
							let arr =data.data.result;
							let exp = eval("/"+e+"/g");
							for(let i=0;i<arr.length;i++){		
							//	if(arr[i].name.search(e) !=-1 || arr[i].email.search(e) !=-1 ){
									arr[i].tip=0;
									this.isFriend(arr[i]);
									arr[i].imgurl = this.serverUrl+'/'+arr[i].imgurl;
									arr[i].name=arr[i].name.replace(exp,"<span style='color:#4AAAFF;'>"+e+"</span>");
									arr[i].email=arr[i].email.replace(exp,"<span style='color:#4AAAFF;'>"+e+"</span>");
									this.userarr.push(arr[i]);
								//}
							}
							console.log(this.userarr);
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
				// let arr = datas.friends();
				// let exp = eval("/"+e+"/g");
				// for(let i=0;i<arr.length;i++){
					
					
				// 	if(arr[i].name.search(e) !=-1 || arr[i].email.search(e) !=-1 ){
				// 		this.isFriend(arr[i]);
				// 		arr[i].imgurl = '../../static/images/img/'+ arr[i].imgurl;
				// 		arr[i].name=arr[i].name.replace(exp,"<span style='color:#4AAAFF;'>"+e+"</span>");
				// 		arr[i].email=arr[i].email.replace(exp,"<span style='color:#4AAAFF;'>"+e+"</span>");
				// 		this.userarr.push(arr[i]);
				// 	}
				// }
				// console.log(this.userarr);
			},
			isFriend: function(e){
				let tip=0;
				if(e._id==this.uid){
					tip = 2;
					e.tip = tip;
				}else{
					uni.request({
						url:this.serverUrl+'/search/isfriend',
						data:{
							uid: this.uid,
							fid: e._id,
							token:this.token,
						},
						method: 'POST',
						success:(data)=>{
							console.log(data);
							let status = data.data.status;
							if(status==200){//是好友
								tip=1;					
							}else if(status==400){ //不是好友 目前不做操作
								
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
							e.tip = tip;
							console.log(e.tip);
						}
					})
				}

				
				// let tip=0;
				// let arr = datas.isFriend();
				// for(let i=0 ; i<arr.length ; i++){
				//   if(arr[i].friend == e.id)
				// 	  {tip = 1;}
				// }
				// e.tip=tip;
				
			},
			toIndex: function(){
				uni.navigateBack({delta:1, });  //返回一層
			},
			getElementStyle: function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data=>{
					console.log("得到布局位置訊息"+JSON.stringify(data));
					console.log("得到離頁面頂部的距離為"+data.top);
					this.widHeight=data.height;
				}).exec();
			},
			modify: function(type,data,ispwd){
				 
				if(ispwd==false){
					this.ispwd='none';
				}else{
					this.ispwd='';
				}
				if(type){
				this.modifyTitle=type;
				}
				this.data=data;
				if(this.ok){
				if(this.modifyTitle=="暱稱"){
					this.dataarr.name=this.tmpcontent;
				}else if(this.modifyTitle=="簽名"){
					this.dataarr.sign=this.tmpcontent;
				}
				this.tmpcontent='';
				this.ok=false;
				}
				this.isModify=!this.isModify;
				var animation = uni.createAnimation({
					duration:300,
					timingFunction:'ease',
				});
				
				if(this.isModify){
					animation.bottom(0).step();
				}else{
					animation.bottom(-this.widHeight).step();
				}
				this.animationData=animation.export();
			},
			//添加好友按鈕
			addFriendBtn :function(fid){
				this.fid=fid;
				this.msg=this.myname+'請求添加好友!!',
				this.modify();
			},
			//確定添加好友
			addSubmit: function(){
				if(this.msg.length>0){
					this.modify();
					uni.request({
						url:this.serverUrl+'/friend/applyfriend',
						data:{
							uid: this.uid,
							fid: this.fid,
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
			modifySubmit: function(){
				//方法
				this.ok=true;
				this.modify();
			},
		}
	}
</script>

<style lang="scss">
@import "../../commons/css/mycss.scss";
.top-bar{
	background:rgba(255,255, 255, 0.96);//帶透明度
	padding: 15rpx;
	border-bottom: 2px solid $uni-border-color;
	.search-div{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index:  -1;
	
		box-sizing: border-box;
		padding: 14rpx 118rpx 14rpx $uni-spacing-col-base;
		float:left;
	} 
	.search{
		padding: 0 60rpx 0 12rpx;
		width: 78%;
		height: 60rpx;
		background: $uni-text-color-inverse;
		border-radius: 10rpx;
		
	}
	.search-img{
		position: absolute;
		right: 210rpx;
		top: 20rpx;
		width: 40rpx;
		height: 40rpx;
		 
	}
	.top-bar-right{
		position: absolute;
		right: 10rpx;
		top: 0rpx;
		
	}

}
	.main{
		position: relative;
		top: 80rpx;
		width: 90%;
	//	right: 140rpx;
		//border: 1px solid red;
		padding: 10rpx $uni-spacing-col-base;
		.result{ 
			
			padding-top: $uni-spacing-col-base;
			.title{
				
				font-size: 44rpx;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 60rpx;
			}
			.list{
			//	border: 1px solid red;
				width: 100%;
				padding: 20rpx 0;
				height:110rpx ;
				image{
					float: left;
					height: 80rpx;
					width: 80rpx;
					border-radius: $uni-border-radius-circle;
				}
				.names{
					float:  left;
					padding-left: $uni-spacing-col-base;
				.name{
					font-size: 36rpx;
					color:  $uni-text-color;
					line-height:  50rpx;
				}
				.email{
					font-size:  $uni-font-size-sm;
					color: $uni-text-color;
					line-height: 28rpx;
				}
					
				}
				.right-bt{ //特殊用法 right-bt 又分send和add 見class
					 float: right;
					width: 120rpx;
					height: 48rpx;
					
					border-radius: 24rpx;
					font-size:  $uni-font-size-sm;
					
					line-height: 48rpx;
					margin-top: 16rpx;
					text-align: center;
		
					
				}
				.send{
					background-color: $uni-color-primary;
					color: $uni-text-color;
				}
				.add{
					background-color: rgba(74,170,255,0.1);
					color: $uni-color-success;
				}
			}


		}

	}
	/*修改的彈出框*/
	.modify{
		position: fixed; //重要: 固定才不會有滾輪讓你往下滑  才能用動畫!!
		z-index: 1002;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #fff;
		.modify-header{
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display: flex;
			flex-direction: row;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;
			.close{
				padding-left: 32rpx;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			.title{
				flex: auto;
				text-align: center;
				font-size: 40rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.define{
				padding-right: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-color-success;
				line-height: 44rpx;
			}
		}
		.modify-main{
	 
			display:  flex;
			padding: $uni-spacing-col-base;
			flex-direction: column;
			.modify-pwd{
				margin-bottom: $uni-spacing-col-base ;
				padding: 0rpx 20rpx;
				flex:auto;
				height: 88rpx;
				background-color: $uni-bg-color-grey ;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
				width: 94%;
			}
			.modify-content{
				padding: 16rpx 20rpx;
				box-sizing: border-box;
				flex: auto;
				width: 94%;
				height: 386rpx;
				background-color: $uni-bg-color-grey ;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
				
			}
		}
	}
</style>
