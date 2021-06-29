<template>
 <view>
	<view class="submit">
		<view class="submit-chat">
			<view class="bt-img" @tap="records">
				<image :src="toc"></image>
			</view>
			<textarea auto-height="true" class="chat-send btn" :class="{displaynone:isrecord}" @input="inputs" v-model="msg" @focus="focus"></textarea>
			<view class="record btn" :class="{displaynone:!isrecord}" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">按住說話</view>
			<view class="bt-img" @tap="emoji">
				<image src="../../static/images/submit/happy.png"></image>
			</view>
			<view class="bt-img" @tap="moreFun">
				<image src="../../static/images/submit/add.png"></image>
			</view>
		</view>
		<view class="emoji" :class="{displaynone:isemoji}">
			<view class="emoji-send">
				<view class="emoji-send-det" @tap="emojiBack">
					<image src="../../static/images/submit/left-arrow.png"></image>
				</view>
				<view class="emoji-send-bt" @tap="emojiSend">發送</view>
			</view>
			<emoji class="cfg" @emotion="emotion" :height="260"></emoji>
		</view>
		
		<view class="more" :class="{displaynone:ismore}">
			 <view class="more-list" @tap="sendImg('album')">
				 <image src="../../static/images/submit/insert-picture-icon.png"></image>
				 <view class="more-list-title">圖片</view>
			 </view>
			 <view class="more-list" @tap="sendImg('camera')">
			 				 <image src="../../static/images/submit/photo-camera-interface-symbol-for-button.png"></image>
			 				 <view class="more-list-title">拍照</view>
			 </view>
			 <view class="more-list" @tap="chooseLocation">
			 				 <image src="../../static/images/submit/maps-and-flags.png"></image>
			 				 <view class="more-list-title">定位</view>
			 </view>
			 <view class="more-list">
			 				 <image src="../../static/images/submit/video-camera.png"></image>
			 				 <view class="more-list-title">影片</view>
			 </view>
			 <view class="more-list">
			 				 <image src="../../static/images/submit/folder.png"></image>
			 				 <view class="more-list-title">文件</view>
			 </view>
		</view>
	</view>
	 <view class="voice-bg" :class="{displaynone:voiceBg}">
		 <view class="voice-bg-len">
			 <view class="voice-bg-time" :style="{width: vlength/0.6+'%'}">{{vlength}}"</view>
		 </view>
		 <view class="voice-del">上滑取消錄音</view>
	 </view>
 </view>
</template>

<script>
	import emoji from './emoji/emoji.vue';
	const recorderManager = uni.getRecorderManager();
	export default {
		data() {
			return {
				isrecord:false,
				isemoji:true,
				ismore: true,
				toc:"../../static/images/submit/radio-waves.png",
				msg:'', //*****這裡在html用v-model做串接,
				timer:'',
				vlength:0,
				voiceBg: true,
				pageY: 0,
			};
		},
		components:{
			emoji,
		},
		methods:{
			records:function(){ 
				this.isemoji=true;//點錄音時，全部展開項都要關閉
				this.ismore=true;
				setTimeout(()=>{ //及時反饋
					this.getElementHeight();	//沒有這步驟的話，當打開表情，會遮住聊天紀錄，所以要傳給chatroom，做padding，把聊天紀錄擠上來
				},30);
				if(this.isrecord){
					this.isrecord = false;
					this.toc="../../static/images/submit/radio-waves.png";
				}else{
					this.isrecord = true;
					this.toc="../../static/images/submit/keyboard.png";
				}
			},
			emoji:function(){
				this.isemoji=!this.isemoji;
				this.ismore=true; //關閉其他項目
				this.isrecord = false;
					this.toc="../../static/images/submit/radio-waves.png";
				
				setTimeout(()=>{ //及時反饋
					this.getElementHeight();	//沒有這步驟的話，當打開表情，會遮住聊天紀錄，所以要傳給chatroom，做padding，把聊天紀錄擠上來
				},30);
			},
			//接收表情 emit用法
			emotion:function(e){
				//console.log(e);
				this.msg=this.msg+e; //加上表情符號 重要
			},
			
			inputs:function(e){
				var chatm = e.detail.value;
				var pos = chatm.indexOf('\n');
				if(pos != -1 && chatm.length>1){
					/*this.$emit('inputss',this.msg);
					setTimeout(()=>{ //避免發送卡頓
						this.msg='';			
					},0)*/
					 this.send(this.msg,0);
				}
			},
			emojiSend:function(){
				/*if(this.msg.length>0){
					this.$emit('inputss',this.msg);
					setTimeout(()=>{ //避免發送卡頓
						this.msg='';	
					},0)			
				*/
			   if(this.msg.length>0){
				   this.send(this.msg,0);
			   }
			},
			emojiBack:function(){
				if(this.msg.length>0){
					this.msg=this.msg.substring(0,this.msg.length-1);//了解怎麼切割字串
				}
			},
			//更多功能
			moreFun: function(){
				this.ismore = !this.ismore;
				this.isemoji = true; //要關閉
				this.isrecord = false;
					this.toc="../../static/images/submit/radio-waves.png";
				
				setTimeout(()=>{ //及時反饋
					this.getElementHeight();	//沒有這步驟的話，當打開表情，會遮住聊天紀錄，所以要傳給chatroom，做padding，把聊天紀錄擠上來
				},30);
			},
			focus:function(){
				this.isemoji=true;
				this.ismore=true;
				setTimeout(()=>{ //避免發送卡頓
					this.getElementHeight();	
				},30)
			},
			getElementHeight: function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data=>{
					this.$emit('heights',data.height);
				}).exec();
			},
			send: function(msg,type){
				let data={
					message:msg,
					types:type,
				}
				this.$emit('inputss',data);
				setTimeout(()=>{
					this.msg='';
				},0);
			},
			sendImg: function(e){
				let count=9;
				if(e == 'album'){
					count = 9;
				}else{
					count = 1;
				}
				uni.chooseImage({
				    count: count, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: [e], //从相册选择
				    success: (res) => {
						const filePaths = res.tempFilePaths;
						for(let i=0 ;i<filePaths.length;i++){
							this.send(filePaths[i],1);
						}
				        //console.log(JSON.stringify(res.tempFilePaths));
				    }
				});
			},
			touchstart: function(e){//錄語音 開始長按事件
				//console.log(e.changedTouches[0].pageY);
				this.pageY = e.changedTouches[0].pageY;
				this.voiceBg=false;
				let i =1;
				this.timer = setInterval(()=>{
					this.vlength = i;
					i++;
					console.log(i);
					if(i>60){
						//結束計時
						clearInterval(this.timer);
						this.touchend();
					}
				},1000)//1000=1秒更新一次
				recorderManager.start();
			},
			touchend: function(){//錄語音 結束長按事件
				console.log("sef");
				this.isrecord=false;
				this.toc="../../static/images/submit/radio-waves.png";
				clearInterval(this.timer);
				recorderManager.stop();
				recorderManager.onStop((res) => {
					let data={
						voice : res.tempFilePath,
						time : this.vlength,
					};
					if(!this.voiceBg){
					this.send(data,2);
					}
					this.vlength=0;
					this.voiceBg=true;	
					console.log('recorder stop'+JSON.stringify(res));
					//self.voicePath = res.tempFilePath;
				});
			},
			touchmove: function(e){//上滑 取消錄音
				//console.log(e.changedTouches[0].pageY);
				if(this.pageY-e.changedTouches[0].pageY>300){
					//console.log("刪除");
					//關閉錄音元件
					this.voiceBg=true;
				}
			},
			chooseLocation:function(){//地圖座標
				uni.chooseLocation({
					success: (res)=>{
							let data={
								name:res.name,
								address:res.address,
								latitude: res.latitude,
								longitude:res.longitude,
							};
							//json轉string，因為後端讀座標時，是用string
							let stringData = JSON.stringify(data);
							setTimeout(()=>{ //及時反饋
								this.send(stringData,3);//沒有這步驟的話，當打開表情，會遮住聊天紀錄，所以要傳給chatroom，做padding，把聊天紀錄擠上來
							},30);
							
							/*console.log('位置名稱'+res.name);
							console.log('詳細地址'+res.address);
							console.log('緯度'+res.latitude);
							console.log('經度'+res.longitude);*/
					}
				});
			},
		}
	}
</script>


<style lang="scss">
 
	.submit{
		height: 100%;
		background: rgba(244,244,244,0.96);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		position: flexd;
		bottom: 0;
		z-index: 2000; //z index 排序貼圖層級 要理解
		padding-bottom:  var(--status-bar-height); 
	}
	.displaynone{
		display: none;
	}
 
	.submit-chat{
		width: 100%;
		//height: 100rpx; //有高度才能把黑線撐開
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding:  14rpx 14rpx;//或用padding撐開
		image{
			width: 50rpx;
			height: 50rpx;
			margin: 0 10rpx;
			flex: auto
		}
		.btn{
			flex:auto;//自動撐開
			background-color: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			max-height: 160rpx;
			margin: 0 10rpx;
		}
		.chat-send{
			line-height: 45rpx;
		}
		.record{
			line-height: 45rpx;
			text-align: center;
			font-size:  33rpx;
			color: $uni-text-color-grey;
			
		}

	}
	.emoji{	
		overflow: hidden;
		overflow-y: scroll;
		width: 100%;
		height: 460rpx;
		background: rgba(236,237,238,1);
		box-shadow: 0px -1rpx 0px 0px rgba(0,0,0,0.1);
		.emoji-send{
			width: 300rpx;
			height: 104rpx;
			padding-top: 24rpx;
			background-color: rgba(236,237,238,0.9);
			position: fixed;
			bottom: 0;
			right: 0;
			display:  flex;
			.emoji-send-bt{
				flex: 1;
				//margin-left: 24rpx;
				margin:0 32rpx 0 32rpx;
				//width:120rpx;
				height: 88rpx;
				background: rgba(255,228,49,1);
				font-size: 32rpx;
				text-align: center;
				line-height: 88rpx ;
				border-radius: 12rpx;
			}
			.emoji-send-det{
				flex: 1;
				margin-left: 24rpx;
				//width:120rpx;
				height: 82rpx;
				background: #fff;
				font-size: 32rpx;
				text-align: center;
				line-height: 88rpx;
				padding-top: 8rpx;
				border-radius: 12rpx;
				image{
					width: 48rpx;
					height: 34rpx;
				}
			}
		}
	}
	.more{ 
		/*overflow: hidden;
		overflow-y: scroll;*/
		width: 100%;
		height: 436rpx;
		background: rgba(236,237,238,1);
		box-shadow: 0px -1rpx 0px 0px rgba(0,0,0,0.1);
		padding: 8rpx 20rpx;
		box-sizing: border-box; //要搞懂
		.more-list{
			width: 25%;
			text-align: center;
			float: left; //原本是直的 變成列排列的關鍵 搞懂和	flex-direction: row;差異
			padding-top: 32rpx;
			image{
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				background: rgba(255,255,255,1);
				border-radius: 24rpx;
			}
		.more-list-title{
			font-size: 24rpx;
			color: rgba(39,40,50,0.5);
			line-height: 34rpx;
		    }
		}
	}
	.voice-bg{
		z-index: -9000;
		height: 100%;
		width: 100%;
		background-color: rgba(0,0,0,0.3);
		position: fixed;
		top: 0;
		bottom: 0;
 
		.voice-bg-len{
			 
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			background-color: rgba(255,255,255,0.2);
			border-radius: 42rpx;
			text-align: center;
			.voice-bg-time{
				display: inline-block;//置中
				min-width: 120rpx;
				line-height: 84rpx;
				background-color: $uni-color-primary;
				border-radius: 42rpx;
			}
		} 

		.voice-del{
			position: absolute;
			bottom: 148rpx;
			margin-bottom: env(safe-area-inset-bottom);
			width: 100%;
			text-align: center;
			color: #fff;
			font-size: $uni-font-size-base;
			
		}
	}
</style>
