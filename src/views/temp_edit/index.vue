<template>
	<div time="1581087113154" class="pl20 pr20 pb20 pt20">
		<div class="like-edit pl20 pr20">
			<div class="clearfix">
				<div class="label pull-left">编辑模板</div>
				<div class="pull-right edit">
					<el-button @click="saveData" size="small" class="pr10" type="success" icon="el-icon-star-on">保存修改</el-button>
					<el-button @click="pullData" size="small" class="" type="primary" icon="el-icon-refresh">刷新数据</el-button>
				</div>
			</div>
		</div>
		<div class="mt20 nav-box ov-y-a pub-flex pub-ai-stretch" :style="{'height': tabHight}">
			<div style="width: 350px;" class="ov-y-a ov-x-a">
				<div class="pt10 pt10 pl10">
					<div>
						<el-tree :data="tableList" :props="defaultProps">
							<div class="custom-tree-node lin28" slot-scope="{node, data}">
		        				<div class="clearfix lin28">
		        					<i v-if="data.hasOwnProperty('children')" style="color: #E6A23C;" class="fa fa-folder pr10"></i>
		        					<i v-else style="color: #E6A23C;" class="fa fa-file-text-o pr10"></i>
			        				<span class="">{{ node.label }}</span>
			        				<div class="pull-right btns-pos">
		        						<div class="pull-right">
		        							<el-button v-if="data.hasOwnProperty('children')" class="ico-btn" type="text" size="mini">
		        								<i style="color: #67C23A;" class="fa fa-plus" aria-hidden="true"></i>
		        							</el-button>
		        							<el-button v-else @click.stop="readFileContent(node, data)" class="ico-btn" type="text" size="mini">
		        								<i style="color: #F56C6C;" class="fa fa-pencil" aria-hidden="true"></i>
		        							</el-button>
		        							<el-button @click.stop="remindDialog(node, data)" class="ico-btn" type="text" size="mini">
		        								<i class="fa fa-trash" aria-hidden="true"></i>
		        							</el-button>
		        						</div>
			        				</div>
		        				</div>
		      				</div>
						</el-tree>
					</div>
				</div>
			</div>
			<div class="pub-flex1 ov-y-h" style="border-left: 1px solid #ddd;">
				<el-input
					v-if="fileContent"
					style="width: 100%;height: 100%;"
					class="codeTextarea"
					type="textarea"
					placeholder="请输入内容"
					v-model="fileContent">
				</el-input>
				<div v-else style="width: 100%; height: 100%;" class="pub-flex pub-jc-center">
					<div>
						<p class="text-center"><i class="fa fa-exclamation-triangle fa-4x" style="color: #F56C6C;"></i></p>
						<p class="mt20">请点击文件读取文件内容！</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { DirCurTempFiles, RemoveTempFile, EditTempFileContent, ReadTempFileContent } from '@api/template'
	import { isDev, catStorage } from '@utils/tools'
	export default {
		data(){
			return {
				tabHight: '0px',
				tableList: [],
				defaultProps: {
          			children: 'children',
          			label: 'label',
        		},
        		fileContent: '',
        		filePath: ''
			}
		},
		methods: {
			removeFiles(data){
				RemoveTempFile({
					filePath: data.path
				}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData(false, false);
						this.fileContent = this.filePath = '';
					}
				})
			},
			saveData(){
				if(!this.fileContent.trim()){
					this.ajaxMsgTips({data: {code: 500, text: '无法提交空内容！'}});
					return
				}
				EditTempFileContent({
					filePath: this.filePath,
					content: this.fileContent
				}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData();
						this.readFileContent(false, {path: this.filePath});
					}
				})
			},
			authFilepSuiffix(str){
				let index = str.lastIndexOf('.');
				let suffix = str.substring(index + 1);
				for(let arg of ['html', 'htm', 'js', 'css', 'php', 'svg', 'js', 'json', 'md']){
					if(suffix === arg){
						return true
					}
				}
				return
			},
			readFileContent(node, data){
				if(!data.path || !this.authFilepSuiffix(data.path)){
					this.ajaxMsgTips({data: {code: 500, text: '该文件不支持在线编辑！'}})
					return
				}
				ReadTempFileContent({
					filePath: data.path
				}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.filePath = data.path;
						this.fileContent = res.data.value;
					}
				})
			},
			// 提醒删除
			remindDialog(node, data){
				this.$confirm('此操作将永久删除该文件或者文件夹, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.removeFiles(data)
		        }).catch(() => { });
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
				DirCurTempFiles({}, {loading: loading})
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
	.lin28{
		height: 26px;
		line-height: 26px;
		font-size: 14px;
		display: block;
		width: 100%;
		position: relative;
	}
	.btns-pos{
		height: 26px;
		line-height: 26px;
		overflow: hidden;
		position: absolute;
		right: 10px;
		top: 0;
		.ico-btn{
			font-weight: bold;
			&:hover{
				color: red;
			}
		}
		.ico-fa{
			width: 15px;
			text-align: center;
		}
	}
</style>
<style class="lang">
	.codeTextarea textarea{
		height: 100%;
		width: 100%;
		border: none;
		overflow-x: auto;
		overflow-y: auto;
		resize:none;
	}
</style>