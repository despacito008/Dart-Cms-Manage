<template>
	<div class="video-drawer-cover" time="1577962209700">
		<el-drawer
			title="查看所有封面图片"
			direction="rtl"
			size="550px"
			class="cat_info"
			:modal="true"
			:append-to-body="true"
			@close="showState = false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			:visible.sync="showState">
			<div class="moreInfo pub-flex pub-column" style="overflow: hidden;">
				<div class="pub-flex" style="width: 100%;">
					<!-- <el-button style="display: block;width: 100%;" type="primary">上传封面</el-button> -->
					<el-upload
						class="upload-demo"
						:action="getUpLoadUrl()"
						:before-upload="authFile"
						:headers="getHeaderConf()"
						:data="{catName: 'cover'}"
						:show-file-list="false"
						:multiple="false"
						:on-success="uploadSuccess">
						<el-button style="width: 100%;display: block;" type="primary">点击上传图片</el-button>
					</el-upload>
					<div class="pub-flex1">
						<p style="color: #F56C6C;" class="pl20">点击图片选择图片</p>
					</div>
				</div>
				<div style="width: 100%;height: 20px;"></div>
				<div class="pub-flex1 cover-row ov-x-h ov-y-a" style="width: 100%;">
					<el-row :gutter="20">
					  	<el-col v-for="item in list" :key="item.path" :span="8">
					  		<div style="padding: 3px;" class="row-img-item">
						  		<div class="pr">
						  			<img @click="selectCoverResult(item.path)" :src="createFilePath(item.path, '/api')" alt="" />
							  		<i @click.stop="remindDialog(item.name)" class="el-icon-close pa icon-btns ico-close"></i>
							  		<i @click.stop="showItemImgNetPath(item)" class="el-icon-share pa icon-btns ico-share"></i>
							  		<p v-if="item.occupt" class="occupy-tip">该图片正在被使用中</p>
						  		</div>
					  		</div>
					  	</el-col>
					</el-row>
				</div>
				<div style="width: 100%;height: 20px;"></div>
			</div>
		</el-drawer>
	</div>
</template>
<script>
	import { DirCoverImgs, UploadImages, RemoveImages } from '@api/video'
	import { DirArtCoverImgs, UploadArtImages, RemoveArtImages } from '@api/article'
	import { catStorage, isDev } from '@utils/tools'
	export default {
		data(){
			return {
				selectType: 'video',   // 文章 || 视频
				showState: false,
				list: [],
			}
		},
		methods: {
			showItemImgNetPath(item){
				let location = window.location;
				let netUrl = location.protocol + '//' + location.host;
				this.ajaxMsgTips({data: {code: 200, text: netUrl + item.path}});
			},
			selectCoverResult(path){
				this.$emit('select', path, 'videoImage');
				this.showState = false;
			},
			remindDialog(fileName){
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.deleteData(fileName)
		        }).catch(() => { });
			},
			deleteData(fileName){
				RemoveImages({
					catName: 'cover',
					fileName
				}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData({remind: false})
					}
				})
			},
			getUpLoadUrl(){
				let path =  UploadImages();
				return isDev() ? `/api${path}` : path
			},
			authFile(file){
				let imgTypeArr = ['.jpg', '.png', '.jpeg', '.gif']
				let index = file.name.lastIndexOf(".");
				let fileType = file.name.substring(index).toLocaleLowerCase();
				for(let arg of imgTypeArr){
					if(arg === fileType){
						return true
					}
				}
				this.$message({
					type: 'warning',
					message: '该上传文件类型不符合要求！'
				})
				return false
			},
			uploadSuccess(res, file, fileList){
				this.ajaxMsgTips({'data': {'code': res.code, 'text': res.text}});
				if(res.code === 200){
					this.pullData({remind: false})
				}
			},
			getHeaderConf(){
				return {
					Token: catStorage('token').value,
				}
			},
			pullData(obj){
				DirCoverImgs()
				.then(res => {
					if(obj.remind){
						this.ajaxMsgTips(res);
					}
					if(res.data.code === 200){
						this.list = res.data.value;
						if(obj.cb && typeof obj.cb === "function"){
							obj.cb()
						}
					}
				})
			}
		},
		created(){
			this.$Bus.$off('changePickerCover');
			this.$Bus.$on('changePickerCover', (conf) => {
				this.selectType = conf.hasOwnProperty('selectType') ? conf.selectType : 'video';
				if(conf.showState){
					this.pullData({
						cb: () => {
							this.showState = conf.showState;
						},
						remind: true,
					})
				}
			})
		}
	}
</script>
<style lang="scss" scoped>
	/* 弹出卡片详细信息 */
	.moreInfo{
		height: 100%;
		margin: 0 20px;
		.tab-cart{
			overflow-y: auto;
		}
	}
	.cover-row{
		img{
			width: 100%;
			vertical-align: top;
		}
		.row-img-item{
			border: 1px solid #ddd;
			border-radius: 4px;
			transition: all .5s;
			overflow: hidden;
			margin-bottom: 20px;
			&:hover{
				border-color: red;
			}
		}
		.icon-btns{
			top: 7px;
			font-size: 20px;
			color: #409EFF;
			font-weight: bolder;
			cursor: pointer;
			transition: all .5s;
			&:hover{
				color: red;
			}
		}
		.ico-close{
			right: 10px;
		}
		.ico-share{
			left: 10px;
		}
		.occupy-tip{
			line-height: 24px;
			font-size: 13px;
			color: #409EFF;
			font-weight: bold;
			text-align: center;
			background: rgba(0,0,0,0.4);
			position: absolute;
			bottom: 0;
			width: 100%;
		}
	}
</style>
<style lang="scss">
	// .video-drawer-cover[time="1577962209700"]{
	// 	.cat_info{
	// 		overflow-y: auto;
	// 		overflow-x: hidden;
	// 	}
	// }
</style>