<template>
	<view>
		<view class= "top-bar">
			<view class="top-bar-left" @tap="toSignIn">
				<image src="../../static/images/common/arrow.png" class="back-img"></image>
		    </view>
			<view class="top-bar-right">
				<view class="more-img">
					<image src="../../static/images/userhome/more.png"></image>
				</view>	
			</view>
		</view>
		
		<view class= "top-bar bgbar" :animation="animationDate">
			<view class="top-bar-left" @tap="toSignIn">
				<image src="../../static/images/common/arrow.png" class="back-img"></image>
		    </view>
			<view class="top-bar-right">
				<view class="more-img">
					<image src="../../static/images/userhome/more.png"></image>
				</view>	
			</view>
		</view>
		
		<view class="bg">
			<image :src="gimg" class="bg-img" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="main-inner">
				<view class="inf">
					<view class="name">元圓</view>
					<view class="time">2021/06/06</view>
					<view class="notice">使用二階差分算子(也可以用一階差分算子, 也就是梯度)提取圖像邊緣圖像。將邊緣圖像加到源圖像上，實現增強邊緣的功能。</view>
				</view>
				<view class="member">
					<view class="top">
						<view class="title">群組成員</view>
						<view class="more">
							管理群組成員
						</view>
						<image src="../../static/images/common/right-arrow-angle.png" mode="aspectFit" class="more-img"></image>
					</view>
					<view class="member-ls">
						<view class="member-li" v-for="(item,index) in groupmember" :key="index">
							<view class="imgs">
								<image src="../../static/images/group/remove.png" mode="aspectFill" class="delete"></image>
								<image :src="item.imgurl" mode="aspectFit" class="user-img"></image>
							</view>
							<view class="name">{{item.name}}</view>
						</view>
						<view class="member-li">
							<view class="imgs">
								<image src="../../static/images/submit/add.png" mode="aspectFit" class="user-add"></image>
							</view>
							<view class="name">邀請</view>
						</view>
					</view>
					<view class="clear"></view>
				</view>
				<view class="mitem">
					<view class="row" @tap="modify('群組名稱','今天沒吃午餐',true)" >
						<view class="title">群組名稱</view>
						<view class="cont">今天沒吃午餐</view>
						<view class="more">
							<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
						</view>
					</view>
					
					<view class="row" >
						<view class="title">群組頭像</view>
						<view class="cont">
							<view class="user-head">
								<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
								<image :src="gimg" @tap="upload" class="group-img"></image>
								<!--<image :src="gimg" class="group-img" mode="aspectFill"></image>-->
							</view>
						</view>
						<view class="more">
							<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
						</view>
					</view>
					
					<view class="row" @tap="modify('gnotice','今天沒吃午餐，今天沒吃午餐，今天沒吃午餐，今天沒吃午餐，今天沒吃午餐，今天沒吃午餐，今天沒吃午餐，今天沒吃午餐','肚肚',true)">
						<view class="title">群組公告</view>
						<view class="cont">今天沒吃午餐，今天沒吃午餐，今天沒吃午餐，今天沒吃午餐，今天沒吃午餐，今天沒吃午餐，今天沒吃午餐，今天沒吃午餐</view>
						<view class="more">
							<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
						</view>
					</view>
					
					<view class="row" @tap="modify('giname','群組稱號','想吃午餐',true)">
						<view class="title">群組稱號</view>
						<view class="cont">想吃午餐</view>
						<view class="more">
							<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
						</view>
					</view>
					
					<view class="row">
						<view class="title">關閉訊息提醒</view>
						<view class="cont"></view>
						<view class="more">
							<switch :checked="sw" @change="switchChange" color="rgba(255,228,49,1)" class="switch"></switch>
						</view>
					</view>
				</view>
			  <view class="bt2">解散群組</view>	
			</view>
		</view>
		
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation="animationData1">
			<view class="modify-header">
				<view class="close" @tap="modify()">取消</view>
				<view class="title">{{modifyTitle}}</view>
				<view class="define" @tap="modifySubmit()">確定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="data" class="modify-content"></textarea>
			</view>
		</view>
		
	</view>
</template>
<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import datas from "../../commons/js/datas.js";
	//mode="aspectFill"了解下
	//../../static/images/img/sun.png
	export default {
		data() {
			return {
				gid:'',
				gimg:'',
				groupmember:[],
				sw:false,
				top:0,
				animationDate:{},
				tempFilePath:'',
				date: '',
				tempFilePath: '',
				data:"修改的內容",   
				isModify:false,
				widHeight:'',
				modifyTitle:'簽名',
				animationData1:{},
			};
		},
		components: {ImageCropper},
		onLoad:function(e){
			this.gid=e.gid;
			this.gimg=e.gimg;
			this.getMember();
			 
		},
		onReady:function(){ //記住要放這裡  放onload 因為組件都沒仔近來 所以也讀不到top
			this.getTop();
			this.getElementStyle();
		},
		methods:{
			toSignIn: function(){
				uni.navigateBack({delta:1, });  //返回一層
			},
			getMember:function(){
				let members = datas.friends();
				for(let i=0;i<members.length;i++){
					members[i].imgurl = '../../static/images/img/'+members[i].imgurl;
					this.groupmember.push(members[i]);
				}
				console.log(this.groupmember);
			},
			switchChange:function(e){
				console.log(e.target.value);
			},
			getTop: function(){
				console.log(this.top);
				const query = uni.createSelectorQuery().in(this);
				query.select('.main-inner').boundingClientRect(data=>{
					this.top=data.top;
					 
					console.log(this.top);
				}).exec();
				
			},
			//頂部動畫
			addAnimation:function(){
				var animation = uni.createAnimation({
					duration:300,
					timingFunction:'linear',//速度一致  ease的動畫會有加速度
				});
				if(this.top<60){
					animation.opacity(1).step();
				}else{
					animation.opacity(0).step();
				}
				this.animationDate=animation.export();
			},
			onPageScroll:function(){
				this.getTop();
				this.addAnimation();
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
			  this.gimg = e.detail.tempFilePath;
			  	
			},
			cancel() {
					            console.log('canceled')
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
				  
				if(type){
				this.modifyTitle=type;
				}
				this.data=data;
				if(this.ok){
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
				this.animationData1=animation.export();
				console.log(this.widHeight);
			},
			
			modifyContent: function(e){	
					 
					this.tmpcontent=e.detail.value;
			},
			
			modifySubmit: function(){
				//方法
				this.ok=true;
				this.modify();
			},
			
			
		},
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.clear{
		clear: both;
	}
	.bgbar{
		background-color: #fff;
	}
	.bg{
		width: 100%;
		height: 100%;
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		.bg-img{
			width: 100%;
			height: 750rpx;
		}
	}
	.main{
		padding-top: 360rpx;
		
		.main-inner{
			width: 100%;
			min-height: 720rpx;
			background-color: #fff;
			border-radius: 40rpx 40rpx 0 0;
		}
		.inf{
			padding: $uni-spacing-row-base $uni-spacing-col-base 0;
			padding-bottom: 40rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #eee;
			.name{
				float: left;
				font-size: 48rpx;
				font-weight: 600;
				color: #272832;
				line-height: 66rpx;
			}
			.time{
				float: right;
				font-size: 28rpx;
				color: rgba(39,40,50,0.5);
				line-height: 66rpx;
			}
			.notice{
				padding-top: 20rpx;
				
				font-size: 28rpx;
				color: #272832;
				line-height: 40rpx;
				clear: both;//了解下 可以增加佔位
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}
		.member{
			border-bottom: 1px solid #eee;
			.top{
				//border: 1px solid red;
				padding: $uni-spacing-row-base $uni-spacing-col-base 0;
				box-sizing: border-box;
				height: 100rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-end; //了解下
				.title{
					flex: 1; //了解下 排版重要
					font-size:36rpx;
					font-weight: 600;
					color: #272832;
				}
				.more{
					float: right;
					padding-right: 20rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: rgba(39,40,50,0.6);
				}
				.more-img{
					width: 16rpx;
					height: 28rpx;
				}
			}
			
			.member-ls{
				width: 100%;
				padding: 20rpx 16rpx;
				box-sizing: border-box;
				.member-li{
					padding-bottom: 32rpx;
					width: 20%;
					float: left;
					text-align: center;
					.imgs{
						display:  inline-block; //讓圖像居中
						position: relative;
						width: 104rpx;
						height: 104rpx;
						border-radius: 20rpx;
						background-color: $uni-color-primary;
					}
					.user-img{
						width: 104rpx;
						height: 104rpx;
						border-radius: 20rpx;
					}
					.delete{
						width: 40rpx;
						height: 40rpx;
						position: absolute;
						top: -16rpx;
						right: -16rpx;
						z-index: 10;
					}
					.name{
						padding: 0 8rpx;
						font-size: 28rpx;
						color: #272832;
						line-height: 40rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
					.user-add{
						width: 104rpx;
						height: 104rpx;
						padding: 32rpx;
						box-sizing: border-box;//常用 為了不超出  可以硬擠在父框框裡
						
					}
				}
			}

		}
		.mitem{
				display: flex;
				flex-direction:  column;
				padding-top: 12rpx;
				width: 100%;
				border-bottom: 1px solid #eee;
				.row{
					display: flex;
					flex-direction: row;
				}
				.title{
					margin-left: $uni-spacing-row-sm;
					flex: none;
					padding-left:0 $uni-spacing-col-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 112rpx;
				}
				.head{
					height: 148rpx;
					display: flex;
					align-items: center; //注意這裡display和align-items的連招
					
				}
				.user-img{
					width: $uni-img-size-lg;
					height: $uni-img-size-lg;
					border-radius: $uni-border-radius-base;
				}
				.cont{
					margin-left: $uni-spacing-row-sm;
					flex:auto;
					display: flex;
					align-items: center;
					font-size: $uni-font-size-lg;
					color:$uni-text-color-grey;
					line-height: 112rpx;
					height: 112rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
				.group-img{
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
					margin-top: 16rpx;
				}
				.more{
					flex:  none;
					height: 112rpx;
					display: flex;	
					align-items: center;
					image{
					width: 80rpx;
					height: 28rpx;
					}
				}
				.switch{
					margin-right: 22rpx;
				}
		}
		.bt2{
			margin-top: 80rpx;
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 88rpx;
			padding-bottom: env(safe-area-inset-bottom);
		}
	}
	
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
