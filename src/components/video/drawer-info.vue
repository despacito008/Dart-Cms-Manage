<template>
	<div class="video-drawer-info" time="1577962095295">
		<el-drawer
			title="查看视频信息"
			direction="rtl"
			size="680px"
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
					<div class="info pub-flex">
						<div class="clearfix" style="width:100%;">
							<!-- 封面图片 -->
							<div class="cover-img pull-left">
								<!-- <img :src="video_info.videoImage.url" alt="" /> -->
								<el-image :src="video_info.videoImage">
							      	<div slot="error" class="image-slot">
							        	<i class="el-icon-picture-outline"></i>
							      	</div>
							    </el-image>
							</div>
							<!-- 视频信息 -->
							<div class="video-info">
								<div>
									<div>
										<h3>{{ video_info.videoTitle }}</h3>
									</div>
									<div class="pub-flex mt10">
										<div>
											<label for="">分类：</label>
											<span class="mr10">{{ video_info.video_type }}</span>
										</div>
										<div>
											<label for="">地区：</label>
											<span class="mr10">{{ video_info.sub_region }}</span>
										</div>
										<div>
											<label for="">年份：</label>
											<span class="mr10">{{ video_info.rel_time }}</span>
										</div>
										<div>
											<label for="">语言：</label>
											<span class="mr10">{{ video_info.language }}</span>
										</div>
									</div>
									<div class="mt10">
										<label for="">导演：</label>
										<span class="mr10" v-for="item in video_info.director.split(',')">{{ item }}</span>
									</div>
									<div class="mt10">
										<label for="">主演：</label>
										<span class="mr10" v-for="item in video_info.performer.split(',')">{{ item }}</span>
									</div>
									<div class="mt10">
										<label for="">更新：</label>
										<span>{{ video_info.update_time }}</span>
									</div>
									<div class="mt10">
										<label for="">状态：</label>
										<span class="">{{ video_info.remind_tip }}</span>
									</div>
									<div class="mt10 pub-flex">
										<label style="height: 20px;line-height: 20px;" for="">评分：</label>
										<div class="in-block">
											<!-- <div style="left: 0;right: 0;top: 0;bottom: 0;z-index: 1;" class="pa"></div> -->
											<!-- <el-rate v-model="video_info.video_rate" :max="10" :allow-half="false" show-text></el-rate> -->
											<el-rate
												:value="video_info.video_rate"
												disabled
												show-score
												:max="10"
												text-color="#FF6600"
												score-template="{value}">
											</el-rate>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="introduce" style="width: 100%;">
					<div class="mt20">
						<h3>剧情介绍</h3>
						<div class="intro-con" v-html="video_info.introduce"></div>
					</div>
				</div>
				<div class="tab-bar" style="width: 100%;">
					<div class="mt20">
						<h3>播放源管理</h3>
					</div>
					<div class="mt10">
						<div class="pub-flex" style="justify-content: flex-start;overflow-x: auto;overflow-y: hidden;">
							<!-- 源名称 -->
							<span @click="curTabIndex = index" :key="item.name" :class="[curTabIndex === index ? 'active' : '', 'tab-btn']" v-for="(item, index) in source_list">{{ item.name }}</span>
						</div>
					</div>
				</div>
				<div class="tab-cart pub-flex1" style="overflow-y: auto;width: 100%;">
					<!-- 源 按钮 列表 -->
					<div v-show="curTabIndex === index" class="play-list pb10 text-left" :key="item.name" v-for="(item, index) in source_list">
						<el-button style="margin-left: 10px;margin-top: 10px;" :key="scource" v-for="scource in item.list" @click="$Bus.$emit('changeVideoPlayer', { 'type': item.type, 'url': scource.split('$')[1], 'showState': true, 'videoTitle':  `${video_info.videoTitle} ${scource.split('$')[0]}` })" size="small" type="primary">{{ scource.split('$')[0] }}</el-button>
					</div>
				</div>
				<div style="height: 20px;width: 100%;"></div>
			</div>
		</el-drawer>
	</div>
</template>
<script>
	import { GetCurVideoList } from '@api/video'
	export default {
		watch: {
			'showState'(n, o) {
				if(!n){
					this.curTabIndex = 0;
				}
			}
		},
		data(){
			return {
				curTabIndex: 0,                  // 默认tabber索引
				showState: false,                // 是否显示
				play_id: "",                     // 视频源ID
				video_info: {
					_id: "",
					videoImage: "",
					director: "",
					poster : "",
					videoTitle: "",
					performer: "",
					video_tags: [],
					video_type: "",
					update_time: "",
					language: "",
					sub_region: "",
					rel_time: "",
					introduce: "",
					remind_tip: "",
					popular: false,
					allow_reply: false,
					scource_sort: false,
					display: false,
				},
				source_list: []
			}
		},
		methods: {
			// 根据guid拉取客户的信息
			pullData(cb, _id){
				GetCurVideoList({_id}, {loading: true})
				.then(res => {
					if(res.data.code === 200){
						let sc = res.data.value;
						for(let arg of sc){
							arg.list = arg.list.split('#');
						}
						// 源列表
						this.source_list = sc;
						// 回调，showState
						cb();
					}else{
						this.source_list = []
					}
				})
				.catch(err => {
					this.source_list = []
				})
			},
		},
		created(){
			this.$Bus.$off('changeVideoDrawerState');
			this.$Bus.$on('changeVideoDrawerState', (conf) => {
				// 视频信息
				this.video_info = Object.assign({}, conf.data.video_info);
				// 视频播放源ID
				this.play_id = conf.showState ? conf.data.play_id : "";
				// 是否显示
				if(conf.showState){
					if(conf.is_pull){
						this.pullData(() => {
							this.showState = true;
						}, conf.data.play_id);
					}else{
						let sc = conf.data.source;
						for(let arg of sc){
							arg.list = arg.list.split('#');
						}
						this.showState = true;
						this.video_info = conf.data.info;
						this.source_list = sc;
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
	.introduce{
		h3{
			border-bottom: 1px solid #eee;
			line-height: 42px;
		}
		.intro-con{
			padding: 10px 0;
			font-size: 16px;
			line-height: 24px;
			word-wrap: break-word;
		    white-space: normal;
		    word-break: break-all;
		    height: 93px;
		    overflow: hidden;
		    overflow-y: auto;
		}
	}
	.tab-bar{
		border-bottom: 1px solid #eee;
		.tab-btn{
			line-height: 40px;
			padding: 0 10px;
			font-size: 14px;
			border-bottom: 1px solid #eee;
			margin-bottom: -1px;
			cursor: pointer;
			border: 1px solid #fff;
			white-space: nowrap;
		}
		.active{
			color: #409eff;
			border: 1px solid #409eff;
		}
	}
</style>