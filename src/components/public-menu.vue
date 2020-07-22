<template>
	<div :class="[isCollapse ? 'shrink' : '', 'panel']">
		<div @click="taggoleColl" class="arrowBtn">
			<i :class="isCollapse ? 'el-icon-caret-right' : 'el-icon-caret-left'"></i>
		</div>
		<div class="list">
			<div :class="[isCollapse ? 'hide' : '', 'l-con']">
				<el-menu :collapse-transition="false" :unique-opened="true" :default-active="activeMenu" background-color="#2d3037" text-color="#BEBEC0" active-text-color="#ffffff" class="el-menu-vertical-demo menu-box app-left-menu-reset" :collapse="isCollapse2">
					<div v-for="(item, index) in allRouter" :key="index">
						<!-- 一级 -->
						<el-menu-item v-if="!item.list" @click="goHome(item.path)" :key="''+index" :index="item.path">
							<i :class="'fa-1x fa-ico fa fa-'+item.icon" aria-hidden="true"></i>
							<span slot="title">{{item.name}}</span>
						</el-menu-item>
						<!-- 二层 -->
						<el-submenu v-else :key="''+index" :index="''+index" style="">
							<template slot="title">
								<i :class="'fa-1x fa-ico fa fa-'+item.icon" aria-hidden="true"></i>
								<span v-show="!isCollapse">{{item.name}}</span>
							</template>
							<!-- 二层单一 -->
							<el-menu-item v-for="(item2, index2) in item.list" v-if="!item2.list" @click="goHome(item2.path)" :key="item2.path" :index="item2.path" style="padding-left: 40px;padding-right: 0;">
								<i :class="'pr10 fa-1x fa-ico fa fa-'+item2.icon" aria-hidden="true"></i>
								<span slot="title">{{item2.name}}</span>
							</el-menu-item>
							<!-- 二层折叠 -->
							<el-submenu v-for="(item2, index2) in item.list"  v-if="item2.list" :key="''+index2" :index="index +'-'+index2" style="">
								<template slot="title">
									<!-- <i class="el-icon-document"></i> -->
									<span>{{item2.name}}</span>
								</template>
								<el-menu-item v-for="(item3, index3) in item2.list" @click="goHome(item3.path)" :key="item3.path" :index="item3.path" style="padding-left: 80px;padding-right: 0;">
									<!-- <i class="el-icon-s-promotion"></i> -->
									<span slot="title">{{item3.name}}</span>
								</el-menu-item>
							</el-submenu>
						</el-submenu>
						<!--  -->
					</div>
				</el-menu>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				activeMenu: "",
				isCollapse: false,
				isCollapse2: false,
				allRouter: [
					{
						name: "系统首页",
						icon: "home",
						path: '/main/index'
					},
					{
						name: "日志管理",
						icon: "bullhorn",
						path: '/main/logs'
					},
					{
						name: "视频管理",
						icon: "video-camera",
						path: '/main/video'
					},
					{
						name: "编辑视频",
						icon: "youtube-play",
						path: '/main/write-video'
					},
					{
						name: "文章管理",
						icon: "file-text",
						path: '/main/article'
					},
					{
						name: "编辑文章",
						icon: "file-text-o",
						path: '/main/write-article'
					},
					{
						name: "脚本管理",
						icon: "file-code-o",
						path: '/main/script'
					},
					{
						name: "任务管理",
						icon: "paper-plane",
						path: '/main/cron'
					},
					{
						name: "用户管理",
						icon: "user-plus",
						path: '/main/user'
					},
					{
						name: "导航管理",
						icon: "bars",
						path: '/main/nav_type'
					},
					{
						name: "消息管理",
						icon: "weixin",
						path: '/main/message'
					},
					{
						name: "模板管理",
						icon: "file",
						path: '/main/temp_list'
					},
					{
						name: "模板编辑",
						icon: "file-text",
						path: '/main/temp_edit'
					},
					{
						name: "恰饭管理",
						icon: "telegram",
						path: '/main/meal'
					},
					{
						name: "友链管理",
						icon: "link",
						path: '/main/link'
					},
					{
						name: "数据备份",
						icon: "database",
						path: '/main/database'
					},
					{
						name: "系统配置",
						icon: "cog",
						path: '/main/config'
					},
					// {
					// 	name: "用户管理",
					// 	icon: "user-plus",
					// 	// path: '/main/member'
					// 	list: [
					// 		{
					// 			name: "会员管理",
					// 			icon: "user-plus",
					// 			path: '/main/member'
					// 		},
					// 		{
					// 			name: "用户管理",
					// 			icon: "user-plus",
					// 			path: '/main/admin'
					// 		}
					// 	]
					// },
					// {
					// 	name: "测评",
					// 	icon:'th-large',
					// 	list: [
					// 		{
					// 			name: "测评模板",
					// 			path: '/main/assessment_template'
					// 		}
					// 	]
					// }
				]
			}
		},
		methods: {
			goHome(path){
				if(path === this.$route.path){
					return
				}
				this.$router.push(path);
			},
			taggoleColl(){
				if(!this.isCollapse){
					this.isCollapse = !this.isCollapse;
					setTimeout(() => {
						this.isCollapse2 = !this.isCollapse2;
					}, 300)
					return
				}
				this.isCollapse2 = !this.isCollapse2;
				this.isCollapse = !this.isCollapse;
			},
			setActiveMenu(){
				// 设置选中
				this.activeMenu = this.$route.path;
			}
		},
		watch: {
			'$route'(n, o){
				this.setActiveMenu();
			}
		},
		mounted(){
			this.setActiveMenu();
		}
	}
</script>
<style lang="scss" scoped>
	.panel{
		height: 100%;
		position: relative;
		-webkit-box-direction: normal;
		width: 240px;
		background: #2d3037;
		transition: all .3s;
		.list{
			height: 100%;
			.l-con{
				overflow-y: auto;
				height: 100%;
			}
		}
		.arrowBtn{
			position: absolute;
			width: 12px;
			height: 60px;
			background: #2d3037;
			border-top-right-radius: 10px;
			border-bottom-right-radius: 10px;
			right: -12px;
			top: 50%;
			margin-top: -30px;
			cursor: pointer;
			color: #ccc;
			text-align: center;
			line-height: 60px;
			i{
				margin-left: -3px;
			}
			&:hover{
				background: #3d414a;
			}
		}
	}
	.panel.shrink{
		width: 64px;
	}
	.l-con{
		.fa-ico{
			width: 30px;
			text-align: center;
		}
	}
</style>
<style lang="scss">
	.l-con.hide{
		i.el-submenu__icon-arrow.el-icon-arrow-right{
			display: none;
		}
	}
	.l-con{
		.el-menu-item.is-active{
			background-color: #454e57!important;
			border-left: 2px solid #3e84e9;
		}
	}
</style>