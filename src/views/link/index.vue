<template>
	<div class="pb20 pt20 pl20 pr20">
		<div class="like-edit pl20 pr20">
			<div class="clearfix">
				<div class="label pull-left">外链管理</div>
				<!-- <div class="query pa">
					<el-input size="small" placeholder="请输入内容" v-model="searchVal" class="input-with-select">
						<el-button class="pointer" @click="pullData" slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</div> -->
				<div class="pull-right edit">
					<el-button @click="editDialog = true" size="small" class="" type="success" icon="el-icon-plus">添加外链</el-button>
					<el-button @click="pullData" size="small" class="" type="primary" icon="el-icon-refresh">刷新数据</el-button>
				</div>
			</div>
		</div>
		<div class="table mt20" time="1579057910781">
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
					prop="name"
					label="外链名称"
					:sortable="true"
					width="240">
					<template slot-scope="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="path"
					label="外链图片"
					:sortable="false"
					:show-overflow-tooltip="true"
					width="350">
				</el-table-column>
				<el-table-column
					prop="link"
					label="外链地址"
					:sortable="false"
					:show-overflow-tooltip="true"
					width="240">
				</el-table-column>
				<el-table-column>
				</el-table-column>
				<el-table-column
			      	fixed="right"
			      	label="操作"
			      	width="130">
			      	<template slot-scope="scope">
						<div class="text-center">
							<el-tooltip class="item" effect="dark" content="编辑" placement="top">
				        		<el-button @click="showEditDialog(scope.row)" size="mini" type="warning">
					        		<i class="fa fa-edit" aria-hidden="true"></i>
				        		</el-button>
			        		</el-tooltip>
		        			<el-tooltip class="item" effect="dark" content="删除" placement="top">
				        		<el-button @click="remindDialog([scope.row])" size="mini" type="danger">
					        		<i class="fa fa-trash" aria-hidden="true"></i>
				        		</el-button>
			        		</el-tooltip>
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
		<el-dialog
			:title="(isEdit ? '编辑' : '添加') + '外链'"
			:visible.sync="editDialog"
			:close-on-click-modal="false"
			:before-close="resetEditInfo"
			width="400px">
			<div class="text-center">
				<div class="row-item clearfix">
					<label class="pull-left" for="">外链名称：</label>
					<div class="row-con">
						<div>
							<el-input size="small" v-model="target.name" placeholder="请输入内容"></el-input>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">外链图片：</label>
					<div class="row-con">
						<div class="pub-flex">
							<div class="pub-flex1">
								<el-input size="small" v-model="target.path" :clearable="true" placeholder="请输入内容"></el-input>
							</div>
							<div class="ml10">
								<el-button @click="$Bus.$emit('changePickerLink', {showState: true})" size="small" type="primary">选择图片</el-button>
							</div>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">外链地址：</label>
					<div class="row-con">
						<div>
							<el-input size="small" v-model="target.link" placeholder="请输入内容"></el-input>
						</div>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" v-if="!isEdit" type="success" @click="insertLinkEv">确 定</el-button>
				<el-button size="small" v-else type="primary" @click="updateLinkEv">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 侧边图片 -->
		<drawer-link @select="setDataValue" />
	</div>
</template>
<script>
	import { GetAllLinks, RemoveLinks, AddLink, UpdateLinks } from '@api/link'
	import { isDev } from '@utils/tools'
	import DrawerLink from './drawer-link.vue'
	export default {
		components: {
			DrawerLink,
		},
		data(){
			return {
				target: {
					name: "",
					path: "",
					link: ""
				},
				isEdit: false,
				loading: false,
				editDialog: false,
				//
				editBox: false,
				curSelectItem: [],  // 当前选中的行
				selectLen: 0,       // 当前选中的个数
				//
				tableData: [],
				loading: false,
				tabHight: 0,        // 动态绑定  el-table高度计算
				pageTotal: 0,       // 总数据条数
				curPageNum: 1,      // 当前第几页
				curPageLen: 15      // 默认每页多少条数据
			}
		},
		methods: {
			showEditDialog({ _id, name, path, link }){
				this.target = {
					_id,
					name,
					path,
					link
				}
				this.isEdit = true;
				this.editDialog = true;
			},
			resetEditInfo(done){
				this.target = {
					name: "",
					path: "",
					link: ""
				}
				this.isEdit = false;
				if(done && typeof done === 'function'){
					done();
				}
			},
			// 侧边栏选中图片
			setDataValue(pathVal, parentKey){
				this.target[parentKey] = pathVal;
			},
			updateLinkEv(){
				UpdateLinks(this.target, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						// 重置
						this.resetEditInfo();
						this.pullData(false);
					}
				})
				.finally(() => {
					this.editDialog = false;
				})
			},
			insertLinkEv(){
				AddLink(this.target, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						// 重置
						this.resetEditInfo();
						this.pullData(false);
					}
				})
				.finally(() => {
					this.editDialog = false;
				})
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
			// 删除
			deleteData(list){
				let paramsList = list.createObjIdArr();
				RemoveLinks({
					list: paramsList
				}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData();
					}
				})
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
			pullData(loadingState = false){
				this.loading = true;
				let query = {
					page: this.curPageNum,
					limit: this.curPageLen
				}
				GetAllLinks(query, {loading: loadingState})
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
			this.pullData(true);
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
			width: 80px;
			padding-right: 10px;
			line-height: 32px;
			text-align: right;
		}
		.row-con{
			padding-left: 90px;
			min-height: 32px;
			line-height: 32px;
		}
	}
</style>
<style lang="scss">
	.table[time="1579057910781"]{
		th{
			font-weight: normal;
			color: #666;
		}
	}
</style>