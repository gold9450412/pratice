<template>
	<view>
		<view class="upload" @tap="upload">上傳圖片</view>
		<image v-for="(item,index) in img":key="index":src="item"></image>
		<button @tap="searchUser">獲取</button>
	</view>
</template>

<script>
	import myfun from '../../commons/js/myfun.js';
	export default {
		data() {
			return {
				id:'asdasdqwe',
				img:[],
			};
		},
	methods:{
		upload: function(){
			//當前日期文件夾
			let url = myfun.fileName(new Date());
			uni.chooseImage({
				count: 6, 
				sizeType: ['original', 'compressed'], //原圖或壓縮圖
				sourceType: ['album','camera'], //相簿或照相
				success: (chooseImageRes) => {
					const tempFilePaths = chooseImageRes.tempFilePaths;
					for(let i=0;i<tempFilePaths.length;i++){
						const uploadTask = uni.uploadFile({
							url: this.serverUrl+'/files/upload', 
							filePath: tempFilePaths[i],
							name: 'file',
							formData: {
								//'url': 'user',
								'url': url,
								'name': new Date().getTime()+this.id+i,
							},
							success: (uploadFileRes) => {
								//let path = 'user/'+uploadFileRes.name;
								
								let path = this.serverUrl+uploadFileRes.data;
								this.img.push(path);
								//console.log(uploadFileRes.data);
							}
						});
									
						uploadTask.onProgressUpdate((res) => {
							console.log('上傳進度' + res.progress);
							console.log('已經上傳' + res.totalBytesSent);
							console.log('預期資料總長度' + res.totalBytesExpectedToSend);
									
 
						});
						}

				}
			});
			},
			searchUser: function(){
				uni.request({
					url:this.serverUrl+'/search/user',
					data:{
						data: '柯',
					},
					method: 'POST',
					success:(data)=>{
						let status = data.data.status;
						 
						if(status==200){
							let res = data.data.result;
							console.log(res)
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
			}
		},
	}
</script>

<style lang="scss">
	.upload{
		padding-top: 40rpx;
		text-align: center;
	}
</style>
