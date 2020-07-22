<template>
	<div>
		<el-dialog
			:title="videoTitle"
			:visible.sync="showState"
			:close-on-click-modal="false"
			width="500px">
			<div class="row-item clearfix">
				<label class="pull-left" for="">评分：</label>
				<div class="row-con">
					<div class="pub-flex" style="height: 32px;justify-content: flex-start;">
						<el-rate v-model="video_rate" :max="10" :allow-half="false" :show-text="false"></el-rate>
					</div>
				</div>
			</div>
			<div class="mt20 text-right">
				<el-button @click="updateVideoInfo" size="small" type="success">确认</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import { ChangeState } from '@api/video'
	export default {
		data(){
			return {
				_id: '',
				video_rate: 0,
				showState: false,
				videoTitle: '',
			}
		},
		methods: {
			updateVideoInfo(){
				ChangeState({
					list: [this._id],
					info: {
						video_rate: this.video_rate,
					}
				}, {loading: true})
				.then(res => {
					this.ajaxMsgTips(res);
					if(res.data.code === 200){
						this.$emit('update');
						this.showState = false;
					}
				})
			}
		},
		watch: {
			'showState'(n, o){
				if(!n){
					this.video_rate = 0;
					this.videoTitle = '';
				}
			}
		},
		created(){
			this.$Bus.$off('changeVideoRateDialog');
			this.$Bus.$on('changeVideoRateDialog', (conf) => {
				this.showState = conf.showState;
				this.videoTitle = conf.showState ? conf.videoTitle : '';
				this.video_rate = conf.showState ? conf.video_rate : 0;
				this._id = conf.showState ? conf._id : '';
			})
		}
	}
</script>
<style lang="scss" scoped>
	.row-item{
		margin-top: 20px;
		label{
			width: 100px;
			padding-right: 10px;
			line-height: 32px;
			text-align: right;
		}
		.row-con{
			padding-left: 110px;
			min-height: 32px;
			line-height: 32px;
			>div{
				max-width: 900px;
			}
		}
	}
</style>