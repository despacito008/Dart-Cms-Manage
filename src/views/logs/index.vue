<template>
	<div class="pl20 pr20 pt20 pb20">
		<!-- 搜索块 -->
		<div class="like-edit pl20 pr20">
			<div class="claerfix">
				<div class="label pull-left">日志管理</div>
				<div class="query pa">
				</div>
				<div class="pull-right edit">
					<el-button @click="pullData" size="small" class="" type="primary" icon="el-icon-refresh">刷新数据</el-button>
				</div>
			</div>
		</div>
		<div class="table mt20" time="1573723242882">
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
				:show-overflow-tooltip="false"
				v-loading="loading"
				selection
				border
				style="width: 100%">
				<el-table-column
			      	type="selection"
		      		width="44">
			    </el-table-column>
				<el-table-column
					prop="event"
					label="日志事件"
					:sortable="true"
					width="300"
					:show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column
					prop="type"
					label="日志类型"
					:sortable="true"
					width="120">
				</el-table-column>
				<el-table-column
					prop="time"
					label="时间"
					:sortable="true"
					width="160">
						<template slot-scope="scope">
							<p class="text-left">{{dateStringify(scope.row.time)}}</p>
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
				        		<span class="ml10">删除</span>
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
	</div>
</template>
<script>
	// api
	import { getAllLogs, RemoveLogs } from '@api/logs'
	export default {
		data(){
			return {
				loading: true,
				//
				editBox: false,
				curSelectItem: [],  // 当前选中的行
				selectLen: 0,       // 当前选中的个数
				//
				tableData: [],
				tabHight: 0,        // 动态绑定  el-table高度计算
				pageTotal: 0,       // 总数据条数
				curPageNum: 1,      // 当前第几页
				curPageLen: 15      // 默认每页多少条数据
			}
		},
		methods: {
			// 提醒
			remindDialog(arr){
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	let newArr = arr.createObjIdArr()
		          	this.deleteLogs(newArr)
		        }).catch(() => { });
			},
			// 删除
			deleteLogs(arr){
				RemoveLogs({list: arr}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res)
					if(res.data.code === 200){
						this.pullData();
					}
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
			pullData(){
				this.loading = true;
				let query = {
					page: this.curPageNum,
					limit: this.curPageLen
				}
				getAllLogs(query, {loading: false})
				.then(res => {
					if(res.data.code === 200){
						this.pageTotal = res.data.value.total;       // 总数据条数
						this.tableData = res.data.value.result;      // rows
					}
				})
				.finally(() => {
					this.loading = false;
				})
			}
		},
		created(){
			this.pullData();
		},
		mounted(){
			this.$nextTick(() => {
				this.getTableHeight();
				window.onresize = this.getTableHeight;
			})
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

</style>
<style lang="scss">
	.table[time="1573723242882"]{
		th{
			font-weight: normal;
			color: #666;
		}
	}
</style>