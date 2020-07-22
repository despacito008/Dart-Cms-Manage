<template>
	<div>
		<el-dialog
			:title="videoTitle"
			:visible.sync="showState"
			:close-on-click-modal="false"
			width="600px">
			<div class="row-item clearfix">
				<label class="pull-left" for="">内容：</label>
				<div class="row-con">
					<p class="word-wrap clothes">{{text}}</p>
				</div>
			</div>
			<div class="row-item clearfix">
				<label class="pull-left" for="">回复：</label>
				<div class="row-con">
					<el-input
						size="small"
						type="textarea"
						:autosize="{ minRows: 3, maxRows: 5}"
						placeholder="请输入内容"
						v-model="reply">
					</el-input>
				</div>
			</div>
			<div class="mt20 text-right">
				<el-button @click="replyMessageEv" size="small" type="success">确认</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import { ReplyMessage } from '@api/message'
	export default {
		data(){
			return {
				vid: "",
				wid: "",
				pid: "",
				text: "",
				reply: "",
				showState: false,
				videoTitle: "",
			}
		},
		methods: {
			replyMessageEv(){
				if(!this.reply.trim()){
					this.ajaxMsgTips({data: {code: 500, text: '回复内容不得为空!'}});
					return
				}
				ReplyMessage({
					vid: this.vid,
					wid: this.wid,
					pid: this.pid,
    				text: this.reply,
				}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.showState = false;
						this.$emit('success');
					}
				})
			}
		},
		created(){
			this.$Bus.$off('changeMessageReplyDialog');
			this.$Bus.$on('changeMessageReplyDialog', (conf) => {
				this.showState = conf.showState;
				if(conf.showState){
					this.vid = conf.vid;        // 视频id，那边的uid
					this.wid = conf.wid;        // 发言者，那边的uid
					this.pid = conf.pid;        // 楼上，那边的_id
					this.text = conf.text;      // 留言内容
					this.videoTitle = '视频： ' + conf.videoTitle;
				}
			})
		},
		watch: {
			'showState'(n, o){
				if(!n){
					this.text =
					this.reply =
					this.videoTitle =
					this.vid =
					this.wid =
					this.pid = "";
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.clothes{
		border-radius: 5px;
		position: relative;
		padding: 5px 10px;
		color: #5a5e66;
		background-color: #edf2fc;
	}
	.row-item{
		margin-top: 20px;
		label{
			width: 75px;
			padding-right: 10px;
			line-height: 32px;
			text-align: right;
		}
		.row-con{
			padding-left: 85px;
			min-height: 32px;
			line-height: 32px;
		}
	}
</style>