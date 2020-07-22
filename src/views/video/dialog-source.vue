<template>
	<div class="dialog-edit-cource" time="1578144601505">
		<el-dialog
			:title="videoTitle"
			:visible.sync="showState"
			:close-on-click-modal="false"
			width="800px">
			<el-tabs v-model="activeName" type="card" >
			    <el-tab-pane label="播放源管理" name="manage">
			    	<div class="tab-con pub-flex pub-column">
			    		<div class="text-left pub-flex pb10" style="width: 100%;">
			    			<el-button @click="SourceUpdateSort" size="small" type="primary">更新排序</el-button>
			    			<p class="pl20" style="color: #F56C6C;">排序之后需要点击更新排序才会生效</p>
			    		</div>
						<div class="pub-flex1" style="width: 100%;">
							<div class="row-item pub-flex" v-for="(item, index) in curSource" :key="item.z_name">
								<i style="color: #67C23A;" class="fa fa-telegram mr10" aria-hidden="true"></i>
								<span>{{ item.name }}</span>
								<div class="pub-flex1"></div>
								<i @click="moveCurSourcePos('top', index)" style="color: #409EFF" class="pointer fa fa-arrow-up ml10" aria-hidden="true"></i>
								<i @click="moveCurSourcePos('bottom', index)" style="color: #409EFF" class="pointer fa fa-arrow-down ml10" aria-hidden="true"></i>
								<i @click="changeEditMode(item)" style="color: #E6A23C" class="pointer fa fa-pencil ml10"></i>
								<i @click="remindDialog({type: 'remove', _id: item._id, text: '此操作将永久删除该数据, 是否继续？'})" style="color: #F56C6C" class="pointer fa fa-trash ml10"></i>
							</div>
						</div>
			    	</div>
			    </el-tab-pane>
			    <el-tab-pane label="播放源编辑" name="edit">
			    	<div class="tab-con pub-column">
						<div class="pub-flex mt20" style="width: 100%;">
							<div class="pub-flex" style="width: 200px;">
								<span style="width: 110px;" class="row-label">源类型：</span>
								<el-select size="small" class="pr20" v-model="target.type" placeholder="请选择">
									<el-option
										v-for="item in [{k: '内置播放器', v: 'player'}, {k: '外链播放器', v: 'iframe'}]"
										:key="item.v"
										:label="item.k"
										:value="item.v">
									</el-option>
								</el-select>
							</div>
							<div class="pr20 pub-flex" style="width: 200px;">
								<span class="row-label">源名称：</span>
								<div class="pub-flex1">
									<el-input size="small" v-model="target.name" placeholder="请输入内容"></el-input>
								</div>
							</div>
<!-- 							<div class="ml20" v-if="isEdit">
								<el-button @click="resetTargetData" size="small" type="danger">切换到新增模式</el-button>
							</div> -->
						</div>
						<div class="mt20" style="width: 100%;">
							<el-input
								type="textarea"
								placeholder="请输入内容"
								v-model="curSourceText"
								:rows="8"
								show-word-limit>
							</el-input>
						</div>
						<div v-if="!isEdit" style="width: 100%;" class="text-right mt20">
							<el-button @click="remindDialog({type: 'add', text: '是否确认添加该播放源到列表？'})" size="small" type="success">确认添加</el-button>
						</div>
						<div v-else style="width: 100%;" class="mt20 pub-flex">
							<div v-if="isEdit" class="pr20">
								<el-button @click="resetTargetData" size="small" type="success">切换到新增模式</el-button>
							</div>
							<div class="pub-flex1 pr20">
								<el-alert
								    title="您正在对播放源进行编辑"
								    type="warning"
								    :closable="false">
	  							</el-alert>
							</div>
							<div>
								<el-button @click="remindDialog({type: 'update', text: '是否确认更新该播放源信息？'})" size="small" type="warning">确认修改</el-button>
							</div>
						</div>
			    	</div>
			    </el-tab-pane>
		  	</el-tabs>
		</el-dialog>
	</div>
</template>
<script>
	import { AddScource, RemoveScource, GetCurVideoList, ScourceSort, UpdateScource } from '@api/video'
	export default {
		data(){
			return {
				isEdit: false,
				activeName: "manage",
				showState: false,
				videoTitle: "",
				curVideoId: "",
				curSource: [],
				target: {
					name: "",
					type: "player",
				},
				curSourceText: "",
			}
		},
		watch: {
			'showState'(n, o){
				this.activeName = 'manage';
			}
		},
		methods: {
			changeEditMode(item){
				this.isEdit = true;
				this.activeName = "edit";
				this.target = {
					'_id': item._id,
					'name': item.name,
					'type': item.type,
					'vid': item.vid,
				}
				this.curSourceText = item.list.split('#').join('\n');
			},
			resetTargetData(){
				this.target = {
					name: "",
					type: "player",
				}
				this.curSourceText = '';
				this.isEdit = false;
			},
			execAddSource(){
				if(!this.target.name.trim()){
					this.$message({
						type: 'warning',
						message: '播放源名称必填！',
						duration: 1000,
					})
					return
				}
				AddScource({
					'name': this.target.name,
					'type': this.target.type,
					'z_name': new Date().getTime() + '',
					'list': this.curSourceText.split('\n').filter((val) => {
						return val && val.trim()
					}).join('#'),
					'vid': this.curVideoId
				}, {loading: true})
				.then((res) => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						// 重置一下
						this.resetTargetData();
						// pull下新的源列表
						this.pullData({
							loading: false,
							_id: this.curVideoId,
							msgTip: false,
						})
					}
				})
			},
			execEditSource(){
				if(!this.target.name.trim()){
					this.$message({
						type: 'warning',
						message: '播放源名称必填！',
						duration: 1000,
					})
					return
				}
				UpdateScource({
					'_id': this.target._id,
					'name': this.target.name,
					'type': this.target.type,
					'list': this.curSourceText.split('\n').filter((val) => {
						return val && val.trim()
					}).join('#'),
					'vid': this.target.vid,
				})
				.then((res) => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData({
							loading: false,
							_id: this.curVideoId,
							msgTip: false,
						})
					}
				})
			},
			remindDialog(obj){
				this.$confirm(obj.text, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	if(obj.type === 'remove'){
		          		// 删除
		          		this.deleteData(_id)
		          	}else if(obj.type === 'add'){
		          		// 新增
		          		this.execAddSource()
		          	}else if(obj.type === 'update'){
		          		// 更新
		          		this.execEditSource()
		          	}
		        }).catch(() => { });
			},
			SourceUpdateSort(){
				if(!this.curSource.length){
					return
				}
				let arr = []
				for(let arg of this.curSource){
					arr.push({
						_id: arg._id,
						index: arg.index
					})
				}
				ScourceSort({
					list: arr
				}, {loading: true})
				.then((res) => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData({
							_id: this.curVideoId,
							loading: false,
							msgTip: false,
						})
					}
				})
			},
			deleteData(_id){
				RemoveScource({_id}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.pullData({
							_id: this.curVideoId,
							loading: false,
							msgTip: false,
						})
					}
				})
			},
			resetSourceItemIndex(){
				for(let [i, arg] of this.curSource.entries()){
					arg['index'] = i;
				}
			},
			moveCurSourcePos(pos, index){
				if(pos === 'top'){
					if(index === 0){
						return
					}
					let prevEl = this.curSource[index - 1];
					let curEl = this.curSource[index];
					//
					this.$set(this.curSource, index - 1, curEl);
					this.$set(this.curSource, index, prevEl);
					this.resetSourceItemIndex();
					return
				}
				if(pos === 'bottom'){
					if(index === (this.curSource.length-1)){
						return
					}
					let nextEl = this.curSource[index + 1];
					let curEl = this.curSource[index];
					//
					this.$set(this.curSource, index + 1, curEl);
					this.$set(this.curSource, index, nextEl);
					this.resetSourceItemIndex();
				}
			},
			pullData(obj){
				GetCurVideoList({
					'_id': obj._id
				}, {loading: obj.loading})
				.then((res) => {
					if(obj.msgTip){
						this.ajaxMsgTips(res);
					}
					if(res.data.code === 200){
						this.curSource = res.data.value;
						if(obj.cb && typeof obj.cb === 'function'){
							obj.cb();
						}
					}
				})
			}
		},
		created(){
			this.$Bus.$off('changeVideoSource');
			this.$Bus.$on('changeVideoSource', (conf) => {
				this.curVideoId = conf.showState ? conf._id : "";
				this.videoTitle = conf.showState ? conf.videoTitle : "";
				// 显示
				if(conf.showState){
					this.pullData({
						cb: () => {
							this.showState = conf.showState;
						},
						_id: conf._id,
						loading: true,
						msgTip: false,
					})
				}else{
					this.showState = false;
				}
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