<template>
	<div time="1581087100956" class="pl20 pr20 pb20 pt20">
		<div class="like-edit pl20 pr20">
			<div class="clearfix">
				<div class="label pull-left">模板管理</div>
				<div class="pull-right edit pub-flex">
					<div class="row-con mr10">
						<el-upload
							class="upload-demo"
							:action="getUpLoadUrl()"
							:before-upload="authFile"
							:headers="getHeaderConf()"
							:show-file-list="false"
							:multiple="false"
							:on-success="uploadSuccess">
							<el-button size="small" style="width: 100%;display: block;" icon="el-icon-upload" type="success">上传模板</el-button>
						</el-upload>
					</div>
					<el-button @click="pullData" size="small" class="" type="primary" icon="el-icon-refresh">刷新数据</el-button>
				</div>
			</div>
		</div>
		<div class="mt20 nav-box ov-y-a" :style="{'height': tabHight}">
			<div class="pl20 pr20 pb20 pt20">
				<div>
					<el-row :gutter="20">
					  	<el-col v-for="item in tableList" :key="item.name" :sm="8" :lg="6" :xl="4">
					  		<el-card class="box-card">
					  			<div class="pr">
						  			<div class="pub-flex pub-ai-center pub-jc-center pt20 pb20">
						  				<i class="fa fa-file-code-o fa-4x" aria-hidden="true"></i>
						  			</div>
						  			<div>
						  				<p class="text-center temp-name text-ellipsis word-wrap">{{ item.name }}</p>
						  			</div>
						  			<div class="text-center mt10">
						  				<el-tooltip class="item" effect="dark" content="使用" placement="top">
							  				<el-button @click="setDefaultTemp(item)" size="small" type="success" round>
							  					<i class="fa fa-cog" aria-hidden="true"></i>
							  				</el-button>
						  				</el-tooltip>
						  				<el-tooltip class="item" effect="dark" content="删除" placement="top">
							  				<el-button @click="remindDialog(item)" size="small" type="danger" round>
							  					<i class="fa fa-trash" aria-hidden="true"></i>
							  				</el-button>
						  				</el-tooltip>
						  			</div>
						  			<div v-if="item.focus" style="top: 0;right: 0;" class="item-row-tip pa">
						  				<i style="color: red;" class="fa fa-check"></i>
						  			</div>
					  			</div>
					  		</el-card>
					  	</el-col>
					</el-row>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { DirCurTempFiles, RemoveTemplate, UploadTemplate, DirTempList, SetCurUseTempName, EditTempFileContent } from '@api/template'
	import { isDev, catStorage } from '@utils/tools'
	export default {
		data(){
			return {
				tabHight: '0px',
				tableList: [],
			}
		},
		methods: {
			getUpLoadUrl(){
				let path = UploadTemplate();
				return isDev() ? `/api${path}` : path
			},
			getHeaderConf(){
				return {
					Token: catStorage('token').value,
				}
			},
			uploadSuccess(res, file, fileList){
				let createRes = {'data': {'code': res.code, 'text': res.text}};
				this.ajaxMsgTips(createRes);
				if(createRes.data.code === 200){
					this.pullData(false, false);
				}
			},
			authFile(file){
				let index = file.name.lastIndexOf(".");
				let fileType = file.name.substring(index+1).toLocaleLowerCase();
				if(fileType === 'zip'){
					return true
				}
				this.$message({
					type: 'warning',
					message: '请上传 zip 格式压缩文件！'
				})
				return false
			},
			// 提醒删除
			remindDialog(row){
				this.$confirm('此操作将永久删除该分类及其子分类, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.deleteData(row)
		        }).catch(() => { });
			},
			// 删除
			deleteData(row){
				if(row.focus){
					this.ajaxMsgTips({'data': {'code': 500, 'text': '该模板已经被使用，无法删除！'}})
					return
				}
				RemoveTemplate({
					name: row.name
				}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData(false, false);
					}
				})
			},
			setDefaultTemp(item){
				if(item.focus){
					this.ajaxMsgTips({'data': {'code': 500, 'text': '该模板已经被使用，无须开启！'}})
					return
				}
				SetCurUseTempName({
					name: item.name
				}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData(false, false);
					}
				})
			},
			// 上传
			uploadTemp(){

			},
			getTableHeight(){
				let getObjH = (className) => {
					return document.getElementsByClassName(className)[0]
				}
				let getObjStyleNum = (obj, attr) => {
					return Number(window.getComputedStyle(obj, null)[attr].split('px')[0]);
				}
				let winH = document.body.clientHeight;
				let headerH = getObjH('header-nav').clientHeight;
				let likeObj = getObjH('like-edit');
				let likeEditH = likeObj.clientHeight;
				let cptCon = getObjH('cpt-con');
				let tableObj = getObjH('nav-box');
				this.tabHight = (winH - (headerH + 44 + likeEditH + getObjStyleNum(tableObj, 'margin-top'))) + 'px';
			},
			pullData(loading=false, tips=false){
				DirTempList({}, {loading: loading})
				.then(res => {
					if(tips){
						this.ajaxMsgTips(res);
					}
					if(res.data.code === 200){
						this.tableList = res.data.value;
					}
				})
			}
		},
		created(){
			this.pullData(true, true)
		},
		mounted(){
			this.$nextTick(() => {
				this.getTableHeight();
				window.onresize = this.getTableHeight;
			})
		},
		beforeDestroy(){
			window.onresize = null;
		}
	}
</script>
<style lang="scss" scoped>
	.like-edit{
		height: 60px;
		position: relative;
		background: #fff;
		border: 1px solid #e6e6e6;
		.label{
			line-height: 60px;
		}
		.query{
			width: 300px;
			left: 50%;
			top: 50%;
			margin-left: -150px;
			margin-top: -16px;
		}
		.edit{
			margin-top: 16px;
		}
	}
	.nav-box{
		border: 1px solid #e6e6e6;
		background-color: #fff;
	}
	.temp-name{
		line-height: 30px;
	}
</style>