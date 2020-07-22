<template>
	<div class="pl20 pr20 pt20 pb20">
		<!-- 搜索块 -->
		<div class="like-edit pl20 pr20">
			<div class="clearfix">
				<div class="label pull-left">用户管理</div>
				<div class="query pa">
					<el-input @change="pullData" size="small" placeholder="请输入内容" v-model="searchVal" class="input-with-select">
						<el-button class="pointer" @click="pullData" slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</div>
				<div class="pull-right edit">
					<el-button @click="editDialog = true" size="small" class="" type="success" icon="el-icon-plus">添加用户</el-button>
					<el-button @click="pullData" size="small" class="" type="primary" icon="el-icon-refresh">刷新数据</el-button>
				</div>
			</div>
		</div>
		<div class="table mt20" time="1579185123029">
			<!-- 头部筛选 -->
			<div class="pl20 pr20">
				<div class="filter-cood">
					<!-- 状态2  编辑块 -->
					<div v-show="editBox" class="pr20">
						<div class="in-block division pr20 mr20">
							已选择 <span style="color: #409EFF;">{{ selectLen }}</span> 项
						</div>
						<div @click="remindDialog(curSelectItem)" class="pointer edit-item-btn mr20">
							<i class="fa fa-trash pr5" aria-hidden="true"></i>
							<span>删除</span>
						</div>
					</div>
				</div>
			</div>
			<!-- 表格内容 -->
			<el-table
				:data="tableData"
				:height="tabHight"
				@selection-change="selectionChange"
				v-loading="loading"
				:show-overflow-tooltip="false"
				selection
				border
				style="width: 100%">
				<el-table-column
			      	type="selection"
		      		width="44">
			    </el-table-column>
				<el-table-column
					prop="userName"
					label="用户名"
					:sortable="true"
					width="240"
					:show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column
					prop="nickName"
					label="昵称"
					:sortable="false"
					:show-overflow-tooltip="true"
					width="220">
				</el-table-column>
				<el-table-column
					prop="admin"
					label="类型"
					:sortable="false"
					:show-overflow-tooltip="true"
					width="140">
					<template slot-scope="scope">
						<span>{{ scope.row.admin ? '管理员' : '会员' }}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="display"
					label="是否禁用"
					:sortable="false"
					width="80">
					<template slot-scope="scope">
						<div class="text-center">
							<el-switch
								v-model="scope.row.display"
								@change="changeVideoState(scope.row._id, $event, 'display', scope.row)"
								active-color="#13ce66"
								inactive-color="#dcdfe6">
							</el-switch>
						</div>
					</template>
				</el-table-column>
				<el-table-column>
				</el-table-column>
				<el-table-column
			      	fixed="right"
			      	label="操作"
			      	width="100">
			      	<template slot-scope="scope">
						<div class="text-center">
			        		<el-button @click="remindDialog([scope.row])" size="mini" type="danger">
				        		<i class="fa fa-trash" aria-hidden="true"></i>
				        		<span class="pl10">删除</span>
			        		</el-button>
						</div>
			      	</template>
			    </el-table-column>
			</el-table>
			<!-- 分页 -->
			<div class="page-list">
				<div class="pr20">
					<el-pagination
						class="pr20"
				      	@size-change="changePageLen"
				      	@current-change="pullNewPageData"
				      	:current-page="curPageNum"
				      	:page-sizes="[15, 30, 60, 100]"
				      	:page-size="curPageLen"
				      	layout="total, sizes, prev, pager, next, jumper"
				      	:total="pageTotal">
				    </el-pagination>
			    </div>
			</div>
		</div>
		<!-- 编辑 -->
		<el-dialog
			title="新增用户"
			:visible.sync="editDialog"
			:close-on-click-modal="false"
			:before-close="resetEditInfo"
			width="400px">
			<div class="text-center">
				<div class="row-item clearfix">
					<label class="pull-left" for="">用户名：</label>
					<div class="row-con">
						<div>
							<el-input size="small" v-model="target.userName" placeholder="请输入内容"></el-input>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">昵称：</label>
					<div class="row-con">
						<div>
							<el-input size="small" v-model="target.nickName" placeholder="请输入内容"></el-input>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">密码：</label>
					<div class="row-con">
						<div>
							<el-input size="small" v-model="target.passWord" placeholder="请输入内容"></el-input>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">类型：</label>
					<div class="row-con">
						<div>
							<el-select style="width: 100%;" size="small" v-model="target.admin" placeholder="请选择">
								<el-option
									v-for="item in [{v: false, i: '前台用户'}, {v: true, i: '后台管理员'}]"
									:key="item.v"
									:label="item.i"
									:value="item.v">
								</el-option>
							</el-select>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">可用：</label>
					<div class="row-con">
						<div class="text-left">
							<el-switch
								v-model="target.display"
								active-color="#13ce66"
								inactive-color="#dcdfe6">
							</el-switch>
						</div>
					</div>
				</div>
				<div v-if="target.admin" class="row-item clearfix">
					<label class="pull-left" for="">权限：</label>
					<div class="row-con">
						<div style="max-height: 300px;" class="ov-y-a">
							<el-tree
								ref="tree"
								:data="treeData"
								accordion
								:show-checkbox="true"
								node-key="key"
								:props="defaultTreeProps">
							</el-tree>
						</div>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" type="success" @click="insertEv">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	// api
	import { GetUserList, UpdateUser, RemoveUser, AddUser } from '@api/user'
	export default {
		data(){
			return {
				loading: true,
				editDialog: false,
				//
				editBox: false,
				searchVal: '',      // 搜索框内容
				curSelectItem: [],  // 当前选中的行
				selectLen: 0,       // 当前选中的个数
				//
				tableData: [],
				tabHight: 0,        // 动态绑定  el-table高度计算
				pageTotal: 0,       // 总数据条数
				curPageNum: 1,      // 当前第几页
				curPageLen: 15,     // 默认每页多少条数据
				//
				target: {
					userName: "",
					passWord: "",
					nickName: "",
					admin: false,
					display: true,
					roleData: {}
				},
				treeData: [
					{
						key: 'logs',
						label: '日志管理',
						children: [
							{
								parentKey: 'logs',
								key: 'removeLogs',
								label: '删除日志'
							}
						]
					},
					{
						key: 'video',
						label: '视频管理',
						children: [
							{
								parentKey: 'video',
								key: 'removeVideo',
								label: '删除视频'
							},
							{
								parentKey: 'video',
								key: 'updateVideo',
								label: '修改视频'
							},
							{
								parentKey: 'video',
								key: 'addVideo',
								label: '新增视频'
							}
						]
					},
					{
						key: 'article',
						label: '文章管理',
						children: [
							{
								parentKey: 'article',
								key: 'removeArticle',
								label: '删除文章'
							},
							{
								parentKey: 'article',
								key: 'updateArticle',
								label: '修改文章'
							},
							{
								parentKey: 'article',
								key: 'addArticle',
								label: '新增文章'
							}
						]
					},
					{
						key: 'script',
						label: '脚本管理',
						children: [
							{
								parentKey: 'script',
								key: 'runScript',
								label: '运行脚本'
							},
							{
								parentKey: 'script',
								key: 'uploadScript',
								label: '上传脚本'
							},
							{
								parentKey: 'script',
								key: 'updateScript',
								label: '修改脚本'
							},
							{
								parentKey: 'script',
								key: 'removeScript',
								label: '删除脚本'
							}
						]
					},
					{
						key: 'cron',
						label: '计划任务',
						children: [
							{
								parentKey: 'cron',
								key: 'createCron',
								label: '创建任务'
							},
							{
								parentKey: 'cron',
								key: 'removeCron',
								label: '删除任务'
							}
						]
					},
					{
						key: 'user',
						label: '用户管理',
						children: [
							{
								parentKey: 'user',
								key: 'addUser',
								label: '新增用户'
							},
							{
								parentKey: 'user',
								key: 'updateUser',
								label: '修改用户'
							},
							{
								parentKey: 'user',
								key: 'removeUser',
								label: '删除用户'
							}
						]
					},
					{
						key: 'nav_type',
						label: '导航管理',
						children: [
							{
								parentKey: 'nav_type',
								key: 'addNavType',
								label: '新增导航'
							},
							{
								parentKey: 'nav_type',
								key: 'updateNavType',
								label: '修改导航'
							},
							{
								parentKey: 'nav_type',
								key: 'removeNavType',
								label: '删除导航'
							}
						]
					},
					{
						key: 'message',
						label: '消息管理',
						children: [
							{
								parentKey: 'message',
								key: 'inspectMessage',
								label: '审批留言'
							},
							{
								parentKey: 'message',
								key: 'removeMessage',
								label: '删除留言'
							},
							{
								parentKey: 'message',
								key: 'replyMessage',
								label: '回复留言'
							}
						]
					},
					{
						key: 'template',
						label: '模板管理',
						children: [
							{
								parentKey: 'template',
								key: 'uploadTemplate',
								label: '上传模板'
							},
							{
								parentKey: 'template',
								key: 'removeTemplate',
								label: '删除模板'
							},
							{
								parentKey: 'template',
								key: 'updateTemplate',
								label: '修改模板'
							}
						]
					},
					{
						key: 'meal',
						label: '恰饭管理',
						children: [
							{
								parentKey: 'meal',
								key: 'addMeal',
								label: '新增恰饭'
							},
							{
								parentKey: 'meal',
								key: 'removeMeal',
								label: '删除恰饭'
							},
							{
								parentKey: 'meal',
								key: 'updateMeal',
								label: '修改恰饭'
							}
						]
					},
					{
						key: 'link',
						label: '友链管理',
						children: [
							{
								parentKey: 'link',
								key: 'addLink',
								label: '新增友链'
							},
							{
								parentKey: 'link',
								key: 'removeLink',
								label: '删除友链'
							},
							{
								parentKey: 'link',
								key: 'updateLink',
								label: '修改友链'
							}
						]
					},
					{
						key: 'backup',
						label: '数据管理',
						children: [
							{
								parentKey: 'backup',
								key: 'execBackup',
								label: '执行数据备份'
							},
							{
								parentKey: 'backup',
								key: 'downloadBackup',
								label: '下载备份数据'
							},
							{
								parentKey: 'backup',
								key: 'removeBackup',
								label: '删除备份数据'
							}
						]
					},
					{
						key: 'config',
						label: '配置管理',
						children: [
							{
								parentKey: 'config',
								key: 'updateConfig',
								label: '修改配置'
							}
						]
					}
				],
				defaultTreeProps: {
					children: 'children',
          			label: 'label'
				}
			}
		},
		methods: {
			// 关闭重置dialog数据
			resetEditInfo(done){
				this.target = {
					userName: "",
					passWord: "",
					nickName: "",
					admin: false,
					display: true,
					roleData: {}
				};
				if(done && typeof done === 'function'){
					done();
				}
			},
			// 提醒删除
			remindDialog(arr){
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.deleteData(arr)
		        }).catch(() => { });
			},
			createRoleData(){
				let obj = {
					logs: {
						removeLogs: false
					},
					video: {
						removeVideo: false,
						updateVideo: false,
						addVideo: false
					},
					article: {
	                    removeArticle: false,
	                    updateArticle: false,
	                    addArticle: false
	                },
					script: {
						runScript: false,
						uploadScript: false,
						updateScript: false,
						removeScript: false
					},
					cron: {
						createCron: false,
						reomoveCron: false
					},
					user: {
						addUser: false,
						updateUser: false,
						removeUser: false
					},
					nav_type: {
						addNavType: false,
						updateNavType: false,
						removeNavType: false
					},
					message: {
						inspectMessage: false,
						removeMessage: false,
						replyMessage: false
					},
					template: {
						selectTemplate: false,
						uploadTemplate: false,
						updateTemplate: false,
						removeTemplate: false
					},
					meal: {
						addMeal: false,
						removeMeal: false,
						updateMeal: false
					},
					link: {
						addLink: false,
						removeLink: false,
						updateLink: false
					},
					backup: {
						execBackup: false,
						downloadBackup: false,
						removeBackup: false
					},
					config: {
						updateConfig: false
					}
				};
				let tar = this.$refs.tree;
				let names = tar.getCheckedKeys();
				let nodes = tar.getCheckedNodes();
				for(let [index, arg] of nodes.entries()){
					// 子节点
					let isChildren = arg.hasOwnProperty('parentKey');
					if(isChildren){
						obj[arg.parentKey][arg.key] = true;
					}
				}
				return obj
			},
			insertEv(){
				if(!this.target.userName.trim()){
					this.ajaxMsgTips({data: {code: 500, text: '用户名不得为空'}})
					return
				}
				if(!this.target.passWord.trim()){
					this.ajaxMsgTips({data: {code: 500, text: '密码不得为空'}})
					return
				}
				if(!this.target.nickName.trim()){
					this.ajaxMsgTips({data: {code: 500, text: '昵称不得为空'}})
					return
				}
				let data = {
					userName: this.target.userName,
					passWord: this.target.passWord,
					nickName: this.target.nickName,
					admin: this.target.admin,
					display: this.target.display,
				}
				if(data.admin){
					data['roleData'] = this.createRoleData();
				}
				//
				AddUser(data, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData();
						this.resetEditInfo();
					}
				})
				.finally(() => {
					this.editDialog = false;
				})
			},
			updateEv(){

			},
			// 删除视频
			deleteData(arr){
				let params = arr.createObjIdArr();
				RemoveUser({
					list: params
				}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData();
					}
				})
			},
			// 显示隐藏
			changeVideoState(_id, bool, key, row){
				let obj = {};
				obj['_id'] = _id;
				obj[key] = bool;
				UpdateUser(obj, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					row.display = res.data.code === 200 ? bool : !bool;
				})
			},
			// 搜索
			searchData(){
				this.editBox = false,
				this.curSelectItem = [],  // 当前选中的行
				this.selectLen = 0,       // 当前选中的个数
				//
				this.tableData = [],
				this.pageTotal = 0,       // 总数据条数
				this.curPageNum = 1,      // 当前第几页
				this.curPageLen = 15      // 默认每页多少条数据
				this.pullData();
			},
			// 选项发生变化
			selectionChange(e){
				// 设置已选多少个
				this.selectLen = e.length;
				// 存当前选中的元素
				this.curSelectItem = e;
				if(e.length){
					this.editBox = true;
				}else{
					this.editBox = false;
				}
			},
			// 切换页码
			pullNewPageData(e){
				this.curPageNum = e;
				this.pullData();
			},
			// 切换每页的条数
			changePageLen(e){
				// 设置每页的条数
				this.curPageLen = e;
				// 重设当前页1
				this.curPageNum = 1;
				// 重新啦数据
				this.pullData();
			},
			// 动态设置table高度
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
				let filterCoodH = getObjH('filter-cood').clientHeight;
				let pageListH = getObjH('page-list').clientHeight;
				let cptCon = getObjH('cpt-con');
				let tableObj = getObjH('table');

				this.tabHight = winH - (headerH + 44 + likeEditH + pageListH + filterCoodH + getObjStyleNum(tableObj, 'margin-top') + getObjStyleNum(cptCon, 'padding-top') + getObjStyleNum(cptCon, 'padding-bottom'));
			},
			// 获取列表数据
			pullData(loadingState = false){
				this.loading = true;
				let query = {
					page: this.curPageNum,
					limit: this.curPageLen
				}
				if(this.searchVal){
					query.search = this.searchVal;
				}
				GetUserList(query, {loading: loadingState})
				.then(res => {
					if(res.data.code === 200){
						let v = res.data.value;
						this.tableData = v.result;
						this.pageTotal = v.total;
					}
				})
				.finally(() => {
					this.loading = false;
				})
			}
		},
		created(){
			this.pullData(false);
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
	.pr5{
		padding-right: 5px;
	}
	.table{
		border: 1px solid #e6e6e6;
		background-color: #fff;
		.filter-cood{
			height: 50px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-direction: row;
			font-size: 14px;
			color: #606266;
			.edit-item-btn{
				display: inline-block;
				color: #777;
				font-size: 13px;
				&:hover{
					color: #3e84e9;
				}
			}
			.division{
				border-right: 1px solid #ccc;
			}
		}
		.page-list{
			height: 40px;
			display: flex;
			justify-content: flex-end;
			flex-direction: row;
			align-items: center;
			width: 100%;
			font-size: 13px;
		}
	}
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
	.row-item{
		margin-top: 20px;
		label{
			width: 75px;
			padding-right: 10px;
			line-height: 32px;
			text-align: right;
		}
		.row-con{
			padding-left: 85px;
			min-height: 32px;
			line-height: 32px;
		}
	}
</style>
<style lang="scss">
	.table[time="1579185123029"]{
		th{
			font-weight: normal;
			color: #666;
		}
	}
</style>