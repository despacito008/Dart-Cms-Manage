<template>
	<div class="dialog-edit-cource" time="1578144601505">
		<el-dialog
			title="批量添加播放源"
			:visible.sync="showState"
			:close-on-click-modal="false"
			width="800px">
			<div class="pb20">
				<p style="color: #F56C6C;">注意：例如 HD高清$http://xxx.xxx.com/xxx/xxx/xxx/xxx/xxx.m3u8</p>
				<p style="color: #F56C6C;">注意：多行回车换行，标题和url中间使用 <span style="color: #409EFF;">$</span> 隔开</p>
			</div>
			<div class="">
				<el-input
					type="textarea"
					:autosize="{ minRows: 15, maxRows: 15}"
					placeholder="请输入内容"
					v-model="sourceVal">
				</el-input>
			</div>
			<div class="pt20 text-right">
				<el-button @click="createList" size="small" type="primary">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				showState: false,
				sourceVal: "",
				curSource: [],
			}
		},
		methods: {
			createList(){
				let result = this.sourceVal.split('\n').filter((val) => {
					return val && val.trim()
				})
				if(!result.length){
					this.$message({
						type: 'warning',
						message: '您没有输入任何记录！'
					})
					return
				}
				this.$confirm(`您输入了 ${result.length} 条记录，是否确认？`, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	this.$emit('select', result);
		        	this.showState = false;
	        	}).catch(() => { });
			}
		},
		watch: {
			'showState'(n, o){
				if(!n){
					this.sourceVal = "";
					this.curSource = [];
				}
			}
		},
		created(){
			this.$Bus.$off('changeEditSource');
			this.$Bus.$on('changeEditSource', (bool) => {
				// 显示
				this.showState = bool
			})
		}
	}
</script>
<style lang="scss" scoped>
	.row-item{
		line-height: 30px;
		font-size: 14px;
		background: #f5f3f3;
		margin-bottom: 2px;
		padding: 0 10px;
		&:hover{
			background: #ddd;
		}
	}
	.tab-con{
		height: 340px;
		overflow: hidden;
	}
</style>