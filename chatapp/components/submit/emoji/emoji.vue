<template>
	<view>
		<view class="emoji" :style="{height:height+'px'}">
			<view class="emoji-line" v-for="(line, i) in emoji" :key="i">
				<view class="emoji-line-item" v-for="(item,index) in line":key="index" @tap="clickEmoji(item)">{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			height:{
				type:Number,
				default:260,
			}
		},
		data() {
			return {
				emoji:[['😀','😁','😂','😅','😆','😉','😊','😋'],
					   ['🤣','😃','😄','😎','😍','😘','😗','😙'],
					   ['😚','😚️️','🙂','🤗','🤔','😐','😑','😶'],
					   ['😚','😚️️','🙂','🤗','🤔','😐','😑','😶'],
					   ['😚','😚️️','🙂','🤗','🤔','😐','😑','😶'],
					   ['😚','😚️️','🙂','🤗','🤔','😐','😑','😶'],
					   ['😚','😚️️','🙂','🤗','🤔','😐','😑','😶'],
					   ['😚','😚️️','🙂','🤗','🤔','😐','😑','😶'],
					   ['😚','😚️️','🙂','🤗','🤔','😐','😑','😶'],
					   ['😚','😚️️','🙂','🤗','🤔','😐','😑','😶'],
					   ['😚','😚️️','🙂','🤗','🤔','😐','😑','😶'],
					   ['😚','😚️️','🙂','🤗','🤔','😐','😑','😶'],
					]
				
			};
		},
		methods:{
			clickEmoji:function(e){
				this.$emit('emotion',e);
			}
		}
	}
</script>

<style lang="scss">
	.emoji{
		width: 100%;
		//height: 100%;
		
		padding: 16rpx 10rpx 1028rpx 10rpx;//各參數的代表 1028是為了讓刪除和發送圖出來
		box-sizing: border-box;
		.emoji-line{
			display: flex;
			.emoji-line-item{
				flex:1; //搞懂
				text-align:  center;
				font-size: 40rpx;
				line-height: 72rpx;
			}
		}
	}
 
</style>
