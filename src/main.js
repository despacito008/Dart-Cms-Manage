import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
// import VueVideoPlayer from 'vue-video-player'
import './style/global.css'
// 原型链方法
import './utils/chain.js'
// 字体
import 'font-awesome/css/font-awesome.css'
// 模拟进度条
import 'nprogress/nprogress.css'
// element-css
import 'element-ui/lib/theme-chalk/index.css'
// 全局组件骨架
import publicShelves from '@components/public-shelves'
// videojs style
// import 'video.js/dist/video-js.css'


Vue.component('public-shelves', publicShelves);
Vue.use(ElementUI);
// Vue.use(VueVideoPlayer);

let RootApp = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

export default RootApp