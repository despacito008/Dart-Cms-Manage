import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import { authToken, setPageTitle, catStorage, removeData } from '@utils/tools'


Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '首页',
        redirect: '/main',
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/login',
        name: '用户登录',
        meta: {
            requireAuth: false
        },
        component: () => import ( /* webpackChunkName: "login" */ '../views/login/index.vue')
    },
    {
        path: '/main',
        name: '系统首页',
        meta: {
            requireAuth: true
        },
        component: () => import ('../components/public-shelves.vue'),
        redirect: '/main/index',
        children: [
            {
                path: 'index',
                name: '系统首页',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "index" */ '../views/main/index.vue')
            },
            {
                path: 'logs',
                name: '日志管理',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "logs" */ '../views/logs/index.vue')
            },
            {
                path: 'video',
                name: '视频管理',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "video" */ '../views/video/index.vue')
            },
            {
                path: 'write-video',
                name: '编辑视频',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "write-video" */ '../views/write-video/index.vue')
            },
            {
                path: 'article',
                name: '视频管理',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "article" */ '../views/article/index.vue')
            },
            {
                path: 'write-article',
                name: '编辑文章',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "write-article" */ '../views/write-article/index.vue')
            },
            {
                path: 'script',
                name: '脚本管理',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "script" */ '../views/script/index.vue')
            },
            {
                path: 'cron',
                name: '计划任务',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "cron" */ '../views/cron/index.vue')
            },
            {
                path: 'user',
                name: '用户管理',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "user" */ '../views/user/index.vue')
            },
            {
                path: 'nav_type',
                name: '导航管理',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "nav_type" */ '../views/nav_type/index.vue')
            },
            {
                path: 'message',
                name: '消息管理',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "message" */ '../views/message/index.vue')
            },
            {
                path: 'temp_list',
                name: '模板管理',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "temp_list" */ '../views/temp_list/index.vue')
            },
            {
                path: 'temp_edit',
                name: '模板编辑',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "temp_edit" */ '../views/temp_edit/index.vue')
            },
            {
                path: 'meal',
                name: '恰饭管理',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "meal" */ '../views/meal/index.vue')
            },
            {
                path: 'link',
                name: '友链管理',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "link" */ '../views/link/index.vue')
            },
            {
                path: 'database',
                name: '数据备份',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "backup" */ '../views/backup/index.vue')
            },
            {
                path: 'config',
                name: '系统配置',
                meta: {
                    requireAuth: true
                },
                component: () => import ( /* webpackChunkName: "config" */ '../views/config/index.vue')
            },
        ]
    },
    {
        path: '*',
        name: '页面没有找到',
        meta: {
            requireAuth: false
        },
        component: () => import ( /* webpackChunkName: "nodefine" */ '../views/nodefine/index.vue')
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach(( to, from, next ) => {
    let authVal = authToken();
    // 已登录想再去登录页
    if( authVal && to.path === '/login' ) {
        next('/main/index');
        return
    }
    // 未登录想去内容页
    if( !authVal && to.meta.requireAuth ) {
        next('/login');
        return
    }
    // 设置标题
    setPageTitle(to.name);
    // 设置进度条
    NProgress.start();
    // 进入路由
    next();
})

router.afterEach(( to, from ) => {
    // 设置进度条
    NProgress.done();
})
export default router
