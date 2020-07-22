<template>
	<div time="1577589984746" class="main pl20 pr20 pb20 pt20">
		<el-row :gutter="20">
		  	<el-col :xs="24" :sm="8" :lg="8" class="pb20">
		  		<el-card class="box-card">
					<div slot="header" class="pub-flex" style="color: #515356">
						<i class="fa fa-user fa-1x"></i>
					    <span class="ml10">{{ loginInfo.userName }}</span>
					</div>
					<div class="login-cart pl20 pr20 pt10 pb10">
						<div class="clearfix item">
							<label class="pull-left" for="">本次登录时间</label>
							<p>{{ loginInfo.nowLoginTime }}</p>
						</div>
						<div class="clearfix item">
							<label class="pull-left" for="">本次登录IP</label>
							<p>{{ loginInfo.nowLoginIp }}</p>
						</div>
						<div class="clearfix item">
							<label class="pull-left" for="">NodeJS版本</label>
							<p style="font-weight: bold; color: red;">{{ loginInfo.nodeVersion }}</p>
						</div>
						<div class="clearfix item">
							<label class="pull-left" for="">MongoDB版本</label>
							<p style="font-weight: bold; color: red;">{{ loginInfo.mongoVersion }}</p>
						</div>
					</div>
				</el-card>
		  	</el-col>
		  	<el-col :xs="24" :sm="16" :lg="16">
		  		<div class="item-cart">
		  			<el-row :gutter="20">
						<el-col :xs="24" :sm="12" :md="12" :lg="6" class="pb20">
							<el-card class="box-card" style="">
								<div class="cart-head text-center pub-flex cart-bg-warning" style="justify-content: center;">
									<i class="fa fa-user fa-2x pl10 pr10"></i>
									<span class="pl10 pr10">用户</span>
								</div>
								<div class="cart-con text-center">
									{{ tagTotal.member }}
								</div>
							</el-card>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="6" class="pb20">
							<el-card class="box-card" style="">
								<div class="cart-head text-center pub-flex cart-bg-danger" style="justify-content: center;">
									<i class="fa fa-weixin fa-2x pl10 pr10"></i>
									<span class="pl10 pr10">留言</span>
								</div>
								<div class="cart-con text-center">
									{{ tagTotal.message }}
								</div>
							</el-card>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="6" class="pb20">
							<el-card class="box-card" style="">
								<div class="cart-head text-center pub-flex cart-bg-primary" style="justify-content: center;">
									<i class="fa fa-video-camera fa-2x pl10 pr10"></i>
									<span class="pl10 pr10">视频</span>
								</div>
								<div class="cart-con text-center">
									{{ tagTotal.video }}
								</div>
							</el-card>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="6" class="pb20">
							<el-card class="box-card" style="">
								<div class="cart-head text-center pub-flex cart-bg-success" style="justify-content: center;">
									<i class="fa fa-bars fa-2x pl10 pr10"></i>
									<span class="pl10 pr10">分类</span>
								</div>
								<div class="cart-con text-center">
									{{ tagTotal.type }}
								</div>
							</el-card>
						</el-col>
		  			</el-row>
		  		</div>
		  	</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :xs="24" :sm="8" :lg="8" class="pb20">
		  		<el-card class="box-card">
					<div slot="header" class="pub-flex" style="color: #515356">
						<i class="fa fa-user-plus fa-1x"></i>
					    <span class="ml10">最新用户</span>
					</div>
					<div class="new-user">
						<div v-if="memData.length">
							<div class="pt10"></div>
							<ul class="clearfix">
								<li v-for="item in memData" :key="item._id">
									<i class="fa fa-user fa-1x img"></i>
									<p class="text-nowrap">{{item.userName}}</p>
								</li>
							</ul>
						</div>
						<div v-else>
							<div class="pt20 pb20 text-center">暂无注册会员……</div>
						</div>
					</div>
				</el-card>
		  	</el-col>
		  	<el-col :xs="24" :sm="16" :lg="16" class="pb20">
				<el-card class="box-card">
					<div slot="header" class="pub-flex" style="color: #515356">
						<i class="fa fa-weixin fa-1x"></i>
					    <span class="ml10">最新留言</span>
					</div>
					<div class="model">
						<div v-if="msgData.length">
							<ul class="reply">
								<li v-for="item in msgData" :key="item._id">
									<div class="head pr text-left text-nowrap">
										<span style="color: #409EFF;" class="sky-blue">{{item.userName}}</span>
										<span v-if="item.reply"><span class="red"> @ </span><span class="sky-blue">{{item.reply}}</span></span>
										<span> 在 </span>
										<a @click="showVideoDrawer(item.vid)" :title="item.title" >{{item.title}}</a>
										<div class="date text-nowrap text-right">
											<i class="el-icon-time pr10"></i>
											<span>{{timeInterval(item.date)}}</span>
										</div>
									</div>
									<div class="msg clearfix">
										<div class="user-logo text-center" style="color: #666;">
											<i class="fa fa-user fa-2x"></i>
										</div>
										<div class="text-bg">
											<div class="text">
												<p class="word-wrap">{{item.text}}</p>
											</div>
										</div>
									</div>
								</li>
							</ul>
						</div>
						<div v-else>
							<div class="pt20 pb20 text-center">暂无留言内容……</div>
						</div>
					</div>
				</el-card>
		  	</el-col>
		</el-row>
	</div>
</template>
<script>
	import { getAllInfos } from '@api/main'
	export default {
		data(){
			return {
				loginInfo: {
					userName: "默认管理员",
					nowLoginTime: "",
					nowLoginIp: '127.0.0.1',
					nodeVersion: '8.11.0',
					mongoVersion: '4.0.0',
				},
				tagTotal: {
					member: 0,
					type: 0,
					message: 0,
					video: 0,
				},
				msgData: [
					// {
					// 	date: 1577594535476,
					// 	text: "asdasdsddddddddddddddddddddd啊是打算打算啊飒飒大大说adsaSdSddssaasdad爱上大V是飞洒",
					// 	title: "啊实打实大",
					// 	user: "会员1",
					// 	vid: "5e082ea74507537865b63958",
					// 	_id: "5e082ea74507537865b63958",
					// },
				],
				memData: [
					// {
					// 	username: "abcd123456",
					// 	_id: "5e082de34507537865b63955",
					// },
				]
			}
		},
		methods: {
			showVideoDrawer(vid){

			},
			timeInterval(o){
				let n = new Date().getTime();
			    let f = n - o;
			    let bs = (f >= 0 ? '前' : '后');//判断时间点是在当前时间的 之前 还是 之后
			    f = Math.abs(f);
			    if( f < 6e4 ){ return '刚刚' }//小于60秒,刚刚
			    if( f < 36e5 ){ return parseInt(f/6e4)+' 分钟'+bs }//小于1小时,按分钟
			    if( f < 864e5 ){ return parseInt(f/36e5)+' 小时'+bs }//小于1天按小时
			    if( f < 2592e6 ){ return parseInt(f/864e5)+' 天'+bs }//小于1个月(30天),按天数
			    if( f < 31536e6 ){ return parseInt(f/2592e6)+' 个月'+bs }//小于1年(365天),按月数
			    return parseInt( f / 31536e6 ) + ' 年' + bs;//大于365天,按年算
			},
		},
		created(){
			getAllInfos({}, {loading: true})
			.then(res => {
				if(res.data.code === 200){
					let v = res.data.value;
					// login info
					this.loginInfo.userName = v.loginInfo.userName;
					this.loginInfo.nowLoginTime = this.dateStringify(v.loginInfo.nowLoginTime);
					this.loginInfo.nowLoginIp = v.loginInfo.nowLoginIp;
					this.loginInfo.nodeVersion = v.loginInfo.nodeVersion;
					this.loginInfo.mongoVersion = v.loginInfo.mongoVersion;
					// tag total
					this.tagTotal.member = v.tagTotal.member;
					this.tagTotal.message = v.tagTotal.message;
					this.tagTotal.video = v.tagTotal.video;
					this.tagTotal.type = v.tagTotal.type;
					// msg list limit 10
					this.msgData = v.message;
					this.memData = v.member;
				}
			})
		}
	}
</script>
<style lang="scss" scoped>
	.login-cart{
		.item{
			p{
				padding-left: 100px;
			}
			line-height: 24px;
			font-size: 13px;
		}
	}
	.item-cart{
		.cart-head{
			color: #fff;
			padding: 25px 0;
		}
		.cart-bg-success{
			background-color: #67C23A;
		}
		.cart-bg-danger{
			background-color: #F56C6C;
		}
		.cart-bg-warning{
			background-color: #E6A23C;
		}
		.cart-bg-primary{
			background-color: #409EFF;
		}
		.cart-con{
			padding: 30px 0;
			color: #666;
			font-weight: bold;
			font-size: 26px;
		}
	}
	.model{
		.head{
			font-size: 12px;
			line-height: 24px;
			height: 24px;
			padding: 5px;
			padding-right: 70px;
			overflow: hidden;
			a{
				font-size: 12px;
				color: #409EFF;
				cursor: pointer;
				&:hover{
					color: red;
				}
			}
		}
		.date{
			position: absolute;
			right: 5px;
			top: 5px;
			bottom: 0;
			width: 70px;
			line-height: 24px;
			height: 24px;
		}
		.msg{
			.text-bg{
				padding-top: 6px;
			}
			.user-logo{
				float: left;
				width: 40px;
			}
			img{
				width: 30px;
				margin: 5px;
			}
			.text{
				border-radius: 5px;
				position: relative;
				padding: 5px 10px;
				margin: 0 5px 0 50px;
				color: #5a5e66;
				background-color: #edf2fc;
				font-size: 12px;
				&::before{
					margin-top: -6px;
					position: absolute;
					right: 100%;
					top: 15px;
					border: 5px solid transparent;
					border-right-color: #edf2fc;
					content: " ";
					height: 0;
					width: 0;
					pointer-events: none;
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
				}
			}
		}
	}
	.reply{
		li{
			padding: 10px 10px;
			border-bottom: 1px solid #ddd;
			&:hover{
				background: #fafafa;
			}
		}
	}
	.new-user{
		li{
			width: 120px;
			float: left;
			text-align: center;
			font-size: 13px;
			position: relative;
			line-height: 26px;
			display: block;
		  	text-overflow:ellipsis;
		  	overflow: hidden;
		  	white-space: nowrap;
		  	margin-bottom: 10px;
		}
		.img{
			position: absolute;
			max-height: 26px;
			left: 9px;
			top: 6px;
			bottom: 0;
		}
		p{
			padding-left: 30px;
			padding-right: 10px;
			text-align: left;
		}
	}
</style>
<style lang="scss">
	.main[time="1577589984746"] .el-card__body{
		padding: 0;
	}
</style>