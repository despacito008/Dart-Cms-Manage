<template>
	<div v-loading="loading">
		<div class="text-center">
			<el-input @change="pullData" size="small" placeholder="请输入内容" v-model="searchVal" class="input-with-select">
				<el-button class="pointer" @click="pullData" slot="prepend" icon="el-icon-refresh"></el-button>
				<el-button class="pointer" @click="pullData" slot="append" icon="el-icon-search"></el-button>
			</el-input>
		</div>
		<div class="mt10">
			<el-table border :height="300" :data="tableData">
				<el-table-column property="videoTitle" label="视频名称"></el-table-column>
				<el-table-column width="220" property="_id" label="视频ID"></el-table-column>
			</el-table>
		</div>
		<div class="text-center ov-x-a mt10">
			<el-pagination
				class="pr20"
				background
		      	@current-change="pullNewPageData"
		      	:current-page="curPageNum"
		      	:page-sizes="[15, 30, 60, 100]"
		      	:page-size="curPageLen"
		      	layout="total, prev, pager, next"
		      	:total="pageTotal">
		    </el-pagination>
		</div>
	</div>
</template>
<script>
	import { GetVideoList } from '@api/video'
	export default {
		data(){
			return {
				searchVal: '',
				loading: false,
				tableData: [],
				pageTotal: 0,       // 总数据条数
				curPageNum: 1,      // 当前第几页
				curPageLen: 15,     // 默认每页多少条数据
			}
		},
		methods: {
			pullNewPageData(e){
				this.curPageNum = e;
				this.pullData({loading: false, msgTip: false});
			},
			pullData(){
				this.loading = true;
				let query = {
					page: this.curPageNum,
					limit: this.curPageLen
				}
				if(this.searchVal){
					query.search = this.searchVal;
				}
				GetVideoList(query)
				.then((res) => {
					this.ajaxMsgTips(res);
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
			this.$Bus.$off('showVideoPopover');
			this.$Bus.$on('showVideoPopover', this.pullData);
		}
	}
</script>
<style lang="scss" scoped>

</style>