import Vue from 'vue';
import { isDev } from '@utils/tools'

// vue实例传递事件
Vue.prototype.$Bus = new Vue;
// 全局超时器ID
Vue.prototype.$ID= null;

Vue.config.productionTip = false;
// loading show
Vue.prototype.showGlobalLoding = function() {
	this.$Bus.$emit('showLoading')
}
// loading hide
Vue.prototype.hideGlobalLoding = function() {
	this.$Bus.$emit('hideLoading')
}
// 处理ajax提示
Vue.prototype.ajaxMsgTips = function(res){
	let typeKey = res.data.code === 200 ? 'success' : 'warning'
	this.$message({
		type: typeKey,
		message: res.data.text,
		duration: 1000,
	})
}
// 生成 正式，开发 环境的文件访问路径
Vue.prototype.createFilePath = function(url, proxyKey){
	return isDev() ? `${proxyKey}${url}` : url
}
// 加工_id数组
Array.prototype.createObjIdArr = function(key){
	let arr = [];
	for(let arg of this){
		arr.push((key && typeof key === 'string') ? arg[key] : arg['_id'])
	}
	return arr
}
// 格式化时间
Vue.prototype.dateStringify = function(time){
	let fill = (d) => {
		return d < 10 ?  '0' + d : d
	}
	let d = new Date( time );
	return `${d.getFullYear()}-${fill(d.getMonth()+1)}-${fill(d.getDate())} ${fill(d.getHours())}:${fill(d.getMinutes())}:${fill(d.getSeconds())}`
}