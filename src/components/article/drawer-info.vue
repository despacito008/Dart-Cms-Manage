<template>
	<div class="video-drawer-info" time="1589691606150">
		<el-drawer
			title="查看文章信息"
			direction="rtl"
			size="600px"
			class="cat_info"
			:modal="true"
			:append-to-body="true"
			@close="showState = false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			:visible.sync="showState">
			<!-- 头部 -->
			<div class="moreInfo pub-flex pub-column" style="overflow: hidden;">
				<div style="width: 100%;" >
					<h2>{{ article_info.articleTitle }}</h2>
				</div>
				<div class="mt10" style="width: 100%;" >
					<div class="info pub-flex">
						<div class="clearfix" style="width:100%;">
							<!-- 封面图片 -->
							<div class="cover-img pull-left">
								<el-image :src="article_info.articleImage">
							      	<div slot="error" class="image-slot">
							        	<i class="el-icon-picture-outline"></i>
							      	</div>
							    </el-image>
							</div>
							<!-- 视频信息 -->
							<div class="video-info">
								<div>
									<div>
										<h3 style="color: #333;font-size: 20px;">文章介绍：</h3>
									</div>
									<div class="mt10">{{ article_info.introduce }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-cart pt10 pb10" style="overflow-y: auto;width: 100%;">
					<h3 style="color: #333;font-size: 20px;">文章内容：</h3>
				</div>
				<div class="tab-cart pub-flex1" style="overflow-y: auto;width: 100%;">
					<div id="art-con-box" v-html="article_info.content"></div>
				</div>
				<div style="height: 20px;width: 100%;"></div>
			</div>
		</el-drawer>
	</div>
</template>
<script>
	import { GetCurArticle } from '@api/article'
	export default {
		data(){
			return {
				showState: false,            // 是否显示
				aid: "",                     // 文章ID
				article_info: {
					articleTitle: "文章标题",
					articleImage: "",
					poster: "",
					article_type: "",
					introduce: "",
					update_time: "",
					video_id: "",
					content: "",
					allow_reply: false,
					openSwiper: false,
					display: true
				}
			}
		},
		methods: {
			// 根据guid拉取客户的信息
			pullData(cb, _id){
				GetCurArticle({_id}, {loading: true})
				.then(res => {
					if(res.data.code === 200){
						// 文章正文内容
						this.article_info.content = res.data.value[0].content;
						// 回调，showState
						cb();
					}else{
						this.article_info.content = "";
					}
				})
				.catch(err => {
					this.article_info.content = "";
				})
			},
		},
		created(){
			this.$Bus.$off('changeArticleDrawerState');
			this.$Bus.$on('changeArticleDrawerState', (conf) => {
				// 视频信息
				this.article_info = Object.assign({}, conf.data.article_info);
				// 文章id
				this.aid = conf.showState ? conf.data.aid : "";
				// 是否显示
				if(conf.showState){
					if(conf.is_pull){
						this.pullData(() => {
							this.showState = true;
						}, conf.data.aid);
					}else{
						this.showState = true;
						this.article_info = conf.data.info;
						this.article_info.content = conf.data.content;
					}
				}else{
					conf.showState = false;
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
	.info{
		.cover-img{
			width: 180px;
			img{
				width: 100%;
				padding: 2px;
				border: 1px solid red;
			}
		}
		.video-info{
			padding-left: 210px;
			font-size: 14px;
			color: #333;
			label{
				color: #999;
			}
			h3{
				font-size: 24px;
				font-weight: bold;
			}
		}
	}
</style>
<style>
	#art-con-box img{
		max-width: 100%!important;
		height: auto!important;
	}
</style>