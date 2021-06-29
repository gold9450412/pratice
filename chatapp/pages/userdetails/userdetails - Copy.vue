<template>
	<view class="content">
		<view class= "top-bar">
			<view class="top-bar-left" @tap="toSignIn">
				<image src="../../static/images/common/arrow.png" class="back-img"></image>
		    </view>
			<view class="top-bar-center">
				<view class="title">詳情</view>
				
				</view>
			<view class="top-bar-right pice"></view>
		</view>
		<view class="main">
			<view class="column heads">
				<view class="row head">
					<view class="title">頭像</view>
					<view class="cont">
						 <image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>			 
						 <image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more">
						<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
					</view>
				</view>
					<view class="row" @tap="modify('簽名',dataarr.sign,false)">
						<view class="title">簽名</view>
						<view class="cont">
							{{dataarr.sign}}
						</view>
						<view class="more">
							<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
						</view>
					</view>
						<view class="row">
							<view class="title">註冊</view>
							<view class="cont">
								{{ChangeTime(dataarr.time)}}
							</view>
						</view>
			</view>
			
			<view class="column">
				<view class="row" @tap="modify('暱稱',dataarr.name,false)">
					<view class="title">暱稱</view>
					<view class="cont">
						{{dataarr.name}}
					</view>
					<view class="more">
						<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
					</view>
				</view>
					<view class="row">
						<view class="title">性別</view>
						<view class="cont">
								<picker @change="bindPickerChange" :value="index" :range="array">
									<view class="uni-input">{{array[index]}}</view>
								</picker>
						</view>
						<view class="more">
							<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
						</view>
					</view>
						<view class="row">
							<view class="title">生日</view>
							<view class="cont">
								<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
									<view class="uni-input">{{date}}</view>
								</picker>
							</view>
							<view class="more">
								<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
							</view>
						</view>
						<view class="row">
							<view class="title">電話</view>
							<view class="cont">
								{{dataarr.tell}}
							</view>
							<view class="more">
								<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
							</view>
						</view>
						<view class="row" @tap="modify('信箱',dataarr.sign,true)">
							<view class="title">信箱</view>
							<view class="cont">
								{{dataarr.mail}}
							</view>
							<view class="more">
								<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
							</view>
						</view>
			</view>
			
			<view class="column">
				<view class="row">
					<view class="title">密碼</view>
					<view class="cont">
						*********
					</view>
					<view class="more">
						<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="bt2">退出登入</view>
		</view>
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify()">取消</view>
				<view class="title">{{modifyTitle}}</view>
				<view class="define" @tap="modifySubmit()">確定</view>
			</view>
			<view class="modify-main">
				<textarea placeholder="請輸入原密碼" placeholder-style="color:#aaa; font-weight:400" :style="{display:ispwd}" type="text" v-model="pwd" class="modify-pwd"></textarea>
				<textarea v-model="data" class="modify-content" @input="modifyContent"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import myfun from "@/commons/js/myfun.js";
	export default {
		data() {
			const currentDate=this.getDate({
				format:true
			})
			return {
				dataarr:{
					name:'小淡淡',
					sign:'大家好，大家好，大家都要好好的，好好的，開開心心的，欣欣向榮!!!',
					time :new Date(),
					sex:'男',
					birth:'1995-05-01',
					tell:'12345689',
					mail:'appleeyes@gmail.com',
				},
				cropFilePath: '../../static/images/img/sun.png',
				array: ['男','女','未知'],
				index: 0,
				date: currentDate,
				tempFilePath: '',
				data:"修改的內容",   
				pwd:'',
				animationData:{},
				isModify:false,
				widHeight:'',
				modifyTitle:'簽名',
				ispwd:'none',
				tmpcontent:'',
				ok:'',
			};
		},
		computed:{
				startDate(){
					return this.getDate('start');
				},
				endDate(){
					return this.getDate('end');
				}
		},
		components: {ImageCropper},
		onReady:function(){
			this.getElementStyle();
		},
		methods:{
			toSignIn: function(){
				uni.navigateBack({delta:1, });  //返回一層
			},
			ChangeTime: function(date){
				return myfun.detailTime(date);
			},
			bindPickerChange:function(e){
				this.index=e.target.value;
			},
			bindDateChange:function(e){
				this.date=e.target.value;
			},
			getDate(type){
				const date=new Date();
				let year = date.getFullYear();
				let month= date.getMonth()+1;
				let day = date.getDate();
				if(type==='start'){
					year=year-60;
				}else if(type==='end'){
					year=year+2;
				}
				month=month>9? month:'0'+month;
				day=day>9? day:'0'+day;
				return `${year}-${month}-${day}`
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

      // #ifdef APP-PLUS||MP
      uni.uploadFile({
        url: "后端地址上传图片接口地址",
        filePath: this.cropFilePath,
        name: "file",
        fileType: "image",
        //formData:{},传递参数
        success: (uploadFileRes) => {
          var backstr = uploadFileRes.data;
          //自定义操作
        },

        fail(e) {
          console.log("this is errormes " + e.message);
        },
      });

      // #endif
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
	
	modifyContent: function(e){	
			 
			this.tmpcontent=e.detail.value;
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
	background: rgba(255,255,255,0.96);
	border-bottom: 2px solid $uni-border-color;
}
.main{
	padding-top: 118rpx;
	display: flex;
	flex-direction:  column;
	.column{
		display: flex;
		flex-direction:  column;
		padding-top: 12rpx;
		width: 100%;
		border-bottom: 1px solid $uni-border-color;
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
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
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

	}
	.bt2{
		margin-top: 160rpx;
		text-align: center;
		font-size: $uni-font-size-lg;
		color: $uni-color-warning;
		line-height: 88rpx;
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
