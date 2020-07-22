<template>
	<div class="pb20 pt20 pl20 pr20">
		<div class="box pr">
			<div ref="tip-box" class="tip-box">
				<div class="tip-btn btn-warning" @click="showDrawerInfo">
					<div>点</div>
					<div>击</div>
					<div>预</div>
					<div>览</div>
				</div>
				<div class="tip-btn btn-primary mt10" @click="remindDialog({type: 'reset', text: '此操作将清空当前数据, 是否继续?'})">
					<div>新</div>
					<div>增</div>
					<div>文</div>
					<div>章</div>
				</div>
			</div>
			<div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">文章标题：</label>
					<div class="row-con">
						<div>
							<el-input size="small" v-model="info.articleTitle" placeholder="请输入内容"></el-input>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">封面图片：</label>
					<div class="row-con">
						<div class="pub-flex">
							<div class="pub-flex1">
								<el-input size="small" v-model="info.articleImage" placeholder="请输入内容"></el-input>
							</div>
							<div class="pub-flex" style="width: 130px;justify-content: flex-end;">
								<el-button @click="$Bus.$emit('changePickerCover', {showState: true, selectType: 'article'})" size="small" type="success">从资源库中选取</el-button>
							</div>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">开启轮播图：</label>
					<div class="row-con">
						<div class="pub-flex">
							<el-switch
								v-model="info.openSwiper"
								active-color="#13ce66"
								inactive-color="#dcdfe6">
							</el-switch>
							<p class="pl20" style="color: #F56C6C;">开启后，需要上传轮播图，请注意！</p>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">选择轮播图：</label>
					<div class="row-con">
						<div class="pub-flex">
							<div class="pub-flex1">
								<el-input size="small" v-model="info.poster" placeholder="请输入内容"></el-input>
							</div>
							<div class="pub-flex" style="width: 130px;justify-content: flex-end;">
								<el-button @click="$Bus.$emit('changePickerPoster', {showState: true, selectType: 'article'})" size="small" type="success">从资源库中选取</el-button>
							</div>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">类型：</label>
					<div class="row-con">
						<div>
							<el-select v-model="info.article_type" size="small" filterable placeholder="请选择">
								<el-option
									v-for="item in restaurants"
									:key="item._id"
									:label="item.name"
									:value="item._id">
								</el-option>
							</el-select>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">文章介绍：</label>
					<div class="row-con">
						<div>
							<el-input
								size="small"
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 4}"
								placeholder="请输入内容"
								v-model="info.introduce">
							</el-input>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">更新时间：</label>
					<div class="row-con">
						<div>
							<el-date-picker
								size="small"
								value-format="yyyy-MM-dd HH:mm"
						      	v-model="info.update_time"
						      	type="datetime"
						      	placeholder="选择日期时间">
						    </el-date-picker>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">关联视频：</label>
					<div class="row-con">
						<div class="pub-flex">
							<div class="pub-flex1">
								<el-input size="small" v-model="info.video_id" placeholder="多条视频中间用英文逗号(,)隔开"></el-input>
							</div>
							<div class="pub-flex" style="width: 130px;justify-content: flex-end;">
								<el-popover
								    placement="bottom-end"
								    title="选择视频"
								    width="600"
								    @show="$Bus.$emit('showVideoPopover')"
								    trigger="click">
							    	<popover-video />
									<el-button slot="reference" size="small" type="success">从资源库中选取</el-button>
								</el-popover>
							</div>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">文章置顶：</label>
					<div class="row-con">
						<div>
							<el-switch
								v-model="info.popular"
								active-color="#13ce66"
								inactive-color="#dcdfe6">
							</el-switch>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">允许留言：</label>
					<div class="row-con">
						<div>
							<el-switch
								v-model="info.allow_reply"
								active-color="#13ce66"
								inactive-color="#dcdfe6">
							</el-switch>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">是否显示：</label>
					<div class="row-con">
						<div class="pub-flex">
							<el-switch
								v-model="info.display"
								active-color="#13ce66"
								inactive-color="#dcdfe6">
							</el-switch>
							<p class="pl20" style="color: #F56C6C;">默认新建文章显示状态，请注意！</p>
						</div>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">文章内容：</label>
					<div class="row-con">
						<tinymce id="d1" v-model="info.content" :other_options="tinymceArgs"></tinymce>
					</div>
				</div>
				<div class="row-item clearfix">
					<label class="pull-left" for="">提交选择：</label>
					<div class="row-con">
						<div class="pub-flex">
							<el-button v-if="!isEdit" @click="remindDialog({type: 'add', text: '此操作将添加一条数据, 是否继续?'})" size="small" type="success">确认添加</el-button>
							<el-button v-else @click="remindDialog({type: 'edit', text: '此操作将更新一条数据, 是否继续?'})" size="small" type="primary">确认更新</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 侧面封面 -->
		<drawer-cover @select="setDataValue1" />
		<!-- 侧面海报 -->
		<drawer-poster @select="setDataValue2" />
		<!-- 右侧 视频 详细信息 抽屉 -->
		<drawer-info />
	</div>
</template>
<script>
	// components
	import PopoverVideo from './popover-video.vue'
	import DrawerCover from '../write-video/drawer-cover.vue'
	import DrawerPoster from '../write-video/drawer-poster.vue'
	import DrawerInfo from '@components/article/drawer-info.vue'
	// api
	import { GetNavList } from '@api/nav_type'
	import { GetAllArticle, ChangeArtState, AddArticle, UpdateArticle, RemoveArticle, GetCurArticle } from '@api/article'
	import tinymce from 'vue-tinymce-editor'
	import zh_language from './zh_CN.js'
	export default {
		components: {
			tinymce,
			DrawerInfo,
			DrawerCover,
			DrawerPoster,
			PopoverVideo,
		},
		data(){
			return {
				tinymceArgs: {
					height: 400,
					language_url: zh_language
				},
				//
				isEdit: false,
				_id: "",
				infos: {
					articleTitle: "",
					articleImage: "",
					poster: "",
					article_type: "",
					introduce: "",
					update_time: "",
					video_id: "",
					content: "",
					popular: false,
					allow_reply: false,
					openSwiper: false,
					display: true
				},
				info: {},
				restaurants: [],                  // 类型候选
			}
		},
		methods: {
			setDataValue1(pathVal, parentKey){
				this.info['articleImage'] = pathVal;
			},
			setDataValue2(pathVal, parentKey){
				this.info['poster'] = pathVal;
			},
			// 显示侧边预览
			showDrawerInfo(){
				let data = this.createInfoData();
				if(!data){
					return
				}
				this.$Bus.$emit('changeArticleDrawerState', {showState: true, is_pull: false, data});
			},
			remindDialog(obj){
				this.$confirm(obj.text, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	if(obj.type === 'add'){
		          		// 添加
		          		this.insertArticleInfo()
		          	}else if(obj.type === 'edit'){
		          		// 更新
		          		this.updateArticleInfo();
		          	}else if(obj.type === 'reset'){
		          		// 重置
		          		this.$router.push({path: '/main/write-article', query: {time: new Date().getTime()}})
		          	}
		        }).catch(() => { });
			},
			insertArticleInfo(){
				let data = this.createInfoData();
				if(!data){
					return
				}
				AddArticle(data)
				.then((res) => {
					this.ajaxMsgTips(res);
					setTimeout(() => {
						this.$router.push({path: '/main/article'})
					}, 500)
				})
			},
			updateArticleInfo(){
				let data = this.createInfoData();
				if(!data){
					return
				}
				data['_id'] = this._id;
				UpdateArticle(data)
				.then((res) => {
					this.ajaxMsgTips(res);
					setTimeout(() => {
						this.$router.push({path: '/main/article'})
					}, 500)
				})
			},
			searchTypeVal(){
				let curId = this.info.article_type;
				for(let arg of this.restaurants){
					if(arg._id === curId){
						return arg.name.replace('┣━━━━━', '');
					}
				}
			},
			createInfoData(){
				if(!this.info.articleTitle.trim()){
					this.$message({
						type: 'warning',
						message: '文章标题必填！',
						duration: 1000,
					})
					return
				}
				if(!this.info.articleImage.trim()){
					this.$message({
						type: 'warning',
						message: '封面图片必填！',
						duration: 1000,
					})
					return
				}
				if(!this.info.article_type.trim() || this.info.article_type.length !== 24){
					this.$message({
						type: 'warning',
						message: '分类必填！',
						duration: 1000,
					})
					return
				}
				let infoData = {
				    articleTitle: this.info.articleTitle.trim(),
					articleImage: this.info.articleImage,
					poster: this.info.poster,
					article_type: this.info.article_type,
					introduce: this.info.introduce,
					update_time: this.info.update_time,
					video_id: this.info.video_id.trim() ? this.info.video_id.trim().split(',') : [],
					popular: this.info.popular,
					allow_reply: this.info.allow_reply,
					openSwiper: this.info.openSwiper,
					display: this.info.display
				}
				return {
					info: infoData,
					content: this.info.content
				}
			},
			// 拉所有的类型
			pullAllTypes(){
				GetNavList({}, {loading: true})
				.then(res => {
					if(res.data.code === 200){
						let arr = [];
						for(let arg of res.data.value){
							arr.push({'name': arg.name, '_id': arg._id})
							if(arg.children && arg.children.length){
								for(let arg2 of arg.children){
									arr.push({'name': '┣━━━━━' + arg2.name, '_id': arg2._id})
								}
							}
						}
						this.restaurants = arr;
					}
				})
			},
			// 拉取文章的信息
			pullCurArticleInfo(_id){
				GetCurArticle({
					_id
				})
				.then(res => {
					if(res.data.code === 200){
						let info = res.data.value[0];
						info.video_id = info.video_id.join(',');
						this.info = info;
					}
				})
				.catch((err) => {
					this.isEdit = false;
					this.info = Object.assign({}, this.infos);
				})
			},
			setTipBtnStyle(ev){
				let el = this.$refs['tip-box'];
				let num = 0;
				if(ev){
					num = ev.target.scrollTop;
				}
				if(el && el.style){
					el.style.top = ((document.body.clientHeight / 2) + num - 45) + 'px';
				}
			},
			initSetting(){
				let _id = this.$route.query._id;
				this.isEdit = (_id && _id.length === 24) ? true : false;
				this._id = this.isEdit ? _id : "";
				if(this.isEdit){
					this.pullCurArticleInfo(_id);
				}else{
					this.info = Object.assign({}, this.infos);
				}
				this.pullAllTypes();
			},
			// 设置预览按钮的top值
			initEvent(){
				let scrollBox = document.getElementsByClassName('cpt-con')[0];
				this.setTipBtnStyle();
				scrollBox.onscroll = this.setTipBtnStyle
			},
		},
		created(){
			this.initSetting()
		},
		watch:{
			'$route'(n, o){
				this.initSetting()
			}
		},
		mounted(){
			this.$nextTick(this.initEvent);
		},
		beforeDestroy(){
			let scrollBox = document.getElementsByClassName('cpt-con')[0];
			scrollBox.onresize = null;
		}
	}
</script>
<style lang="scss" scoped>
	.box{
		background: #fff;
		padding: 20px;
		border: 1px solid #ddd;
		.tip-box{
			line-height: 20px;
			width: 40px;
			text-align: center;
			position: absolute;
			right: 0;
			top: 50%;
			margin-top: -100px;
			font-size: 14px;
			color: #fff;
			cursor: pointer;
			transition: all .4s;
			.tip-btn{
				padding: 5px 0;
				transition: all .4s;
				&:hover{
					background: #F56C6C;
				}
			}
			.btn-warning{
				background: #E6A23C;
			}
			.btn-primary{
				background: #409EFF;
			}
		}
		.row-item{
			margin-top: 20px;
			label{
				width: 140px;
				padding-right: 10px;
				line-height: 32px;
				text-align: right;
			}
			.row-con{
				padding-left: 150px;
				min-height: 32px;
				line-height: 32px;
				>div{
					max-width: 900px;
				}
			}
		}
		.row-label{
			width: 58px;
			font-size: 14px;
			line-height: 32px;
			display: block;
		}
		.tabs{
			.bar{
				margin-bottom: -1px;
				>div{
					border: 1px solid #ddd;
					line-height: 40px;
					border-top-right-radius: 4px;
					border-top-left-radius: 4px;
					padding: 0 10px;
					font-size: 14px;
					cursor: pointer;
					transition: all .5s;
					margin-right: 2px;
					&:hover{
						background: #ddd;
					}
				}
				.active{
					background: #ddd;
					border-color: #ddd;
				}
			}
			.source-item{
				font-size: 14px;
				background: #f5f3f3;
				transition: all .5s;
				margin-bottom: 1px;
				&:hover{
					background: #ddd;
				}
			}
		}
	}
	.sub-tips{
		line-height: 24px;
		font-size: 14px;
		color: #F56C6C;
	}
</style>