<template>
 <view class="content">
	<view class="submit">
		<view class="submit-chat">
			<view class="bt-img" @tap="records">
				<image :src="toc"></image>
			</view>
			<textarea auto-height="true" class="chat-send btn" :class="{displaynone:isrecord}"></textarea>
			<view class="record btn" :class="{displaynone:!isrecord}">按住說話</view>
			<view class="bt-img" @tap="emoji">
				<image src="../../static/images/submit/happy.png"></image>
			</view>
			<view class="bt-img">
				<image src="../../static/images/submit/add.png"></image>
			</view>
		</view>
		<view class="emoji" :class="{displaynone:isemoji}">
			表情
		</view>
	</view>
 </view>
</template>

<script>
	export default {
		data() {
			return {
				isrecord:false,
				isemoji:true,
				toc:"../../static/images/submit/radio-waves.png",
			};
		},
		methods:{
			records:function(){
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
			}
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
		z-index: 100;
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
		.record{
			text-align: center;
			font-size:  $uni-font-size-lg;
			color: $uni-text-color-grey;
			
		}

	}
	.emoji{
		width: 100%;
		height: 460rpx;
		background: rgba(236,237,238,1);
		box-shadow: 0px -1rpx 0px 0px rgba(0,0,0,0.1);
	}

</style>
