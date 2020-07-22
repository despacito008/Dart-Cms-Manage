<template>
	<div class="shever-box">
		<!-- 头部导航 -->
		<div class="header-nav">
			<public-nav />
		</div>
		<!-- 左右侧内容 -->
		<div class="content-box">
			<!-- 左侧菜单 -->
			<public-menu/>
			<!-- 右侧正文 -->
			<div class="cpt-con">
				<div>
					<router-view/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import PublicMenu from '@components/public-menu.vue'
	import PublicNav from '@components/public-nav.vue'
	export default {
		data(){
			return {

			}
		},
		components: {
			PublicNav,
			PublicMenu,
		}
	}
</script>
<style lang="scss" scoped>
	.shever-box{
		width: 100%;
		height: 100%;
		position: relative;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		flex-direction: column;
		.header-nav{
			width: 100%;
			height: 60px;
			box-shadow: 0 1px 2px #dbdbdb;
			background: #fff;
			overflow: hidden;
			position: relative;
			z-index: 2;
		}
		.content-box{
			flex: 1;
			width: 100%;
			display: -ms-flexbox;
			display: -webkit-flex;
			display: flex;
			flex-direction: row;
			overflow: hidden;
			.cpt-con{
				flex: 1;
				height: 100%;
				// padding: 20px;
				overflow: auto;
				background-color: #f5f6f9;
				>div{
					// height: 100%;
				}
			}
		}
	}
</style>
<style lang="scss">
	.content-box .el-menu{
		border-right: none;
	}
</style>