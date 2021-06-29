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
					<view class="cont" >
						 <image-cropper v-if="id == uid" :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>			 
						 <image v-if="id == uid" :src="cropFilePath" @tap="upload" class="user-img"></image>
						 <image v-if="id != uid" :src="cropFilePath"  class="user-img"></image>	 
					</view>
					<view class="more" v-if="id == uid">
						<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
					</view>
								
				</view>
				
					<view class="row" v-if="id == uid" @tap="modify('explain','簽名',user.explain,false)">
						<view class="title">簽名</view>
						<view class="cont">
							{{user.explain}}
						</view>
						<view class="more">
							<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
						</view>
					</view>
					
					<view class="row" v-if="id != uid">
						<view class="title">簽名</view>
						<view class="cont">
							{{user.explain}}
						</view>
					</view>
					
						<view class="row">
							<view class="title">註冊</view>
							<view class="cont">
								{{ChangeTime(user.time)}}
							</view>
						</view>
			</view>
			
			<view class="column">
				
				<view class="row" v-if="id == uid" @tap="modify('markname','暱稱',user.name,false)">
					<view class="title">暱稱</view>
					<view class="cont">
						{{user.name}}
					</view>
					<view class="more">
						<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row"  v-if="id != uid" @tap="modify('markname','暱稱',markname,false)">
					<view class="title">暱稱</view>
					<view class="cont">
						{{markname}}
					</view>
					<view class="more">
						<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
					</view>
				</view>
				
					<view class="row">
						<view class="title">性別</view>
						<view class="cont">
								<picker v-if="id == uid" @change="bindPickerChange" :value="index" :range="array">
									<view class="uni-input">{{array[index]}}</view>
								</picker>
								<view v-if="id != uid"class="uni-input">{{array[index]}}</view>
						</view>
						<view class="more" v-if="id == uid">
							<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
						</view>
					</view>
						<view class="row">
							<view class="title">生日</view>
							<view class="cont">
								<picker v-if="id == uid" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
									<view class="uni-input">{{date}}</view>
								</picker>
								<view v-if="id != uid" class="uni-input">{{date}}</view>
							</view>
							<view class="more" v-if="id == uid">
								<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
							</view>
						</view>
						<view class="row"  v-if="id == uid" @tap="modify('phone','電話',user.phone,false)">
							<view class="title">電話</view>
							<view class="cont">
								{{user.phone}}
							</view>
							<view class="more" v-if="id == uid">
								<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
							</view>
						</view>
						<view class="row"  v-if="id != uid">
							<view class="title">電話</view>
							<view class="cont">
								{{user.phone}}
							</view>
						</view>
						
						<view class="row" v-if="id == uid" @tap="modify('email','信箱',user.email,true)">
							<view class="title">信箱</view>
							<view class="cont">
								{{user.email}}
							</view>
							<view class="more">
								<image src="../../static/images/userhome/more.png" mode="aspectFit"></image>
							</view>
						</view>
						
						<view class="row" v-if="id != uid" @tap="modify('信箱',dataarr.sign,true)">
							<view class="title">信箱</view>
							<view class="cont">
								{{user.email}}
							</view>
						</view>
						
			</view>
			
			<view class="column" v-if="id == uid" @tap="modify('psw','信箱','',true)">
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
			<view class="bt2" @tap="quit" v-if="id == uid">退出登入</view>
			<view class="bt2" @tap="deleteFriend" v-if="id != uid">刪除好友</view>
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
				id:'', //想成fid
				uid:'',
				myname:'',
				token:'',
				user:'',
				markname:'',
				olddata:'',
				re200:'false',
				cropFilePath: '../../static/images/img/sun.png',
				array: ['男','女','未知'],
				index: 0,
				date: currentDate,
				tempFilePath: '',
				data:'',   
				pwd:undefined,
				type:'',
				animationData:{},
				isModify:false,
				widHeight:'',
				modifyTitle:'簽名',
				ispwd:'none',
				tmpcontent:'',
				ok:'',
			};
		},
		onLoad :function(e){
			this.id = e.id;
			this.getStorages();
			this.getUser();
			this.getMarkname();
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
			//獲取用戶訊息
			getUser: function(){
			//	if(this.id != this.uid){
					uni.request({
						url:this.serverUrl+'/user/detail',
						data:{
							id:this.id,
							token:this.token,
						},
						method: 'POST',
						success:(data)=>{
							console.log(data);
							let status = data.data.status;
							if(status==200){//訪問後端成功
								let res =data.data.result;
								res.imgurl = this.serverUrl+'/'+res.imgurl;
								this.cropFilePath=res.imgurl;
								//處理簡介
								if(res.explain==undefined){
									res.explain = '大家好';
								}
								//處理生日
								if(res.birth==undefined){
									this.date = '0000-00-00';
								}else{
									let birth = myfun.detailTime1(res.birth);
									this.date = birth;
								}
								//處理電話
								if(res.phone==undefined){
									res.phone = '0';
								}
								if(this.markname.length==0){ //沒有markname 則用name代替
									this.markname = res.name;
								}
								this.sexJudge(res.sex);
								this.user=res;
								//console.log(res.sex);
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
				//}
				
			},
			//性別判斷
			sexJudge: function(e){
				if(e == 'female'){
					this.index=1;
				}else if(e == 'male'){
					this.index = 0;
				}else{
					this.index = 2;
				}
			},
			//獲取好友暱稱
			getMarkname: function(){
				uni.request({
					url:this.serverUrl+'/user/getmarkname',
					data:{
						uid: this.uid,
						fid: this.id,
						token:this.token,
					},
					method: 'POST',
					success:(data)=>{
						//console.log(data);
						let status = data.data.status;
						if(status==200){//訪問後端成功
							let res = data.data.result;
							console.log(res);
							if(this.id != this.uid){							if(res.markname){
								this.markname = res.markname; //如果存在
								console.log("暱稱: "+res.markname);
							}
							}}

						else if(status==500){
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
			toSignIn: function(){
				uni.navigateBack({delta:1, });  //返回一層
			},
			ChangeTime: function(date){
				return myfun.detailTime(date);
			},
			bindPickerChange:function(e){
				let oldIndex = this.index;
				this.index=e.target.value;
				if(this.index != oldIndex){
					let sex = 'asexual';
					if(this.index==0){
						sex = 'male';
					}else if(this.index==1){
						sex = 'female';
					}
					this.update(sex,'sex',undefined);
				};

			},
			bindDateChange:function(e){
				let oldDate = this.date;
				this.date=e.target.value;
				if(this.date != oldDate){
					this.update(this.date,'birth',undefined);
				}
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
			                count: 1,  
			                sizeType: ['original', 'compressed'], //原圖、壓縮
			                sourceType: ['album','camera'], //選擇圖片來源: 相簿、照相機
			                success: (res) => {
			                    this.tempFilePath = res.tempFilePaths.shift()
			                }
			            });
			        },

    confirm(e) {
      this.tempFilePath = "";
      this.cropFilePath = e.detail.tempFilePath;
      uni.uploadFile({
        url:this.serverUrl+'/files/upload', //後端地址
        filePath: this.cropFilePath,
        name: "file",
        fileType: "image",
        formData:{
			'url':'user',
			'name': this.uid,
			'token': this.token,
		}, 
        success: (uploadFileRes) => {
          var backstr = uploadFileRes.data;
          //console.log(backstr);
		  //修改本地緩存
		  try{
		  	uni.setStorageSync('user',{'id': this.uid,'name':this.myname,'imgurl':backstr,'token':this.token});
			console.log(backstr);
		  } catch(e){//error
		  	console.log("數據儲存失敗");
		  }
		  this.update(backstr,'imgurl',undefined);
        },

        fail(e) {
          console.log("this is errormes " + e.message);
        },
      });
    },
	cancel() {
		  console.log('canceled')
	},
	//修改數據
	update:function(e,t,p){ //data,type,pwd
		this.re200='false';
		uni.request({
			url:this.serverUrl+'/user/update',
			data:{
				id: this.uid,
				data: e,
				type: t,
				pwd: p,
				token:this.token,
			},
			method: 'POST',
			success:(data)=>{
				console.log(data);
				let status = data.data.status;
				
				if(status==200){//訪問後端成功
					 this.re200='true';
					 if(t == 'psw'){
						 //密碼更改成功 必須重新登入
						 //清空緩存
						 uni.removeStorage({
						 	key: 'user',
							success:function(res) {
								
							}
						 })
						 //重新登入 
						 uni.navigateTo({
						 	url:'../signin/signin?name='+this.myname,
						 });
					 }
					}else if(status==500){
					 this.re200='false';
					uni.showToast({
						title:'伺服器出錯!!',
						icon:'none',
						duration:1500,
					});
				}else if(status==300){//token過期 跳回登入頁面
					this.re200='false';
					uni.navigateTo({
						url:'../signin/signin?name='+this.myname,
					});
				}else if(status==400){
					this.re200='false';
					
					uni.showToast({	
						title:'密碼錯誤!!',
						icon:'none',
						duration:1500,
					});
				}else if(status==600){
					this.re200='false';
					uni.showToast({
						title:'信箱已被占用!!',
						icon:'none',
						duration:1500,
					});
				}
				
			}
		})
	},
	getElementStyle: function(){
		const query = uni.createSelectorQuery().in(this);
		query.select('.modify').boundingClientRect(data=>{
			//console.log("得到布局位置訊息"+JSON.stringify(data));
			//console.log("得到離頁面頂部的距離為"+data.top);
			this.widHeight=data.height;
		}).exec();
	},
	
	
	modify: function(t,type,data,ispwd){
		 
		if(ispwd==false){
			this.ispwd='none';
			this.pwd = undefined;
		}else{
			this.ispwd='';
			this.pwd='0';
		}
		this.type = t;
		if(type){
		this.modifyTitle=type;
		}
		this.data=data;
		this.olddata = data
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
		console.log(this.isModify);
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
		
		if(this.data.length>0 && this.data!=this.olddata){ //如果沒修改 就不進資料庫了
			if(this.type == 'markname'){
				this.updateFriendName();
				this.markname = this.data;
			}else if(this.type == 'email'){
				let reg = /^[0-9a-zA-Z_\.-]+[@][0-9a-zA-Z_\.-]+([\.][a-zA-Z]+){1,2}$/;
				if(reg.test(this.data)){
					this.update(this.data,this.type,this.pwd);
					//前端替換修改 沒有這個的話 必須重新整理才會顯示	
					setTimeout(()=>{ //避免發送卡頓
						if(this.re200=='true')  
						 { 
						  this.user[this.type] = this.data;
						 }				   
					},300);
				}else{
					uni.showToast({
						title:'信箱格式錯誤!!',
						icon:'none',
						duration:2500,
					});
				}
			}else {
				this.update(this.data,this.type,this.pwd);
				//前端替換修改 沒有這個的話 必須重新整理才會顯示	
				setTimeout(()=>{ //避免發送卡頓
					if(this.re200=='true')  
					 { 
					  this.user[this.type] = this.data;
					 }				   
				},300);
				 //等同於this.user.this.type 但這樣不合法 必須用array形式(作用可享為map) 
			}
				
		}
		setTimeout(()=>{ //避免發送卡頓
				//if(this.re200=='true')  
				 {	console.log('3');
					 this.modify(); 
				 }				   
			},300);

	
		
	},
	
	//修改好友暱稱
	updateFriendName: function(){
		if(this.data.length>0 && this.data != this.olddata){
			uni.request({
				url:this.serverUrl+'/user/updatemarkname',
				data:{
					uid: this.uid,
					fid: this.id,
					name: this.data,
					token:this.token,
				},
				method: 'POST',
				success:(data)=>{
					console.log(data);
					let status = data.data.status;
					if(status==200){//訪問後端成功
						console.log("ok");
						}
			
					else if(status==500){
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
	//退出登入
	quit: function(){
		uni.removeStorage({
			key: 'user',
			success:function(res) {
				
			}
		});
		uni.reLaunch({
			url:'../signin/signin',
		});
	},
	//刪除好友
	deleteFriend:function(){
		uni.showModal({
		    title: '提示',
		    content: '確定要刪除此好友嗎?',
		    success: (res) =>{ //注意 function(res)這種做法 沒辦法取到全域變數  必須改為(res)=>
		        if (res.confirm) {
		            uni.request({
		            	url:this.serverUrl+'/friend/deletefriend',
						
		            	data:{
		            		uid: this.uid,
		            		fid: this.id,
		            		token:this.token,
		            	},
		            	method: 'POST',
		            	success:(data)=>{
		            		console.log(data);
		            		let status = data.data.status;
		            		if(status==200){//訪問後端成功
		            			uni.navigateTo({
		            				url:'../index/index',
		            			});
		            			}
		            
		            		else if(status==500){
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
		        } else if (res.cancel) {
		            console.log('用户点击取消');
		        }
		    }
		});
	}
  }
}
</script>

<style lang="scss">
@import "../../commons/css/mycss.scss";
uni-toast {
z-index: 10000;
}
uni-showtoast {
z-index: 10000;
}
page {
background-color: #ebfffe;
}
.top-bar{
	background:rgba(215, 246, 255, 0.5);//帶透明度
	border-bottom: 2px solid $uni-border-color;
	.top-bar-center{
		background:rgba(215, 246, 255, 0.5);//帶透明度
	}
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
