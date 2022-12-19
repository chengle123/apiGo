import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * 注：子菜单仅在route children.length>=1时出现
 * 详见：https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden:true                    如果设置为true，项目将不会显示在侧边栏中（默认为false）
 * alwaysShow: true               如果设置为真，将总是显示根菜单
 *                                如果未设置alwaysShow，则当项目有多个子路由时，
 *                                它将变成嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为noRedirect，则面包屑中不会重定向
 * name:'router-name'             名称由<keep alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'/'el-icon-x' 图标显示在侧边栏中
    noCache: true                如果设置为true，则不会缓存该页（默认值为false）
    affix: true                  如果设置为true，则标记将附加在“标记”视图中
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认值为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */

/**
 * 线上路由
 * hidden: true 是否显示在侧边栏
 * affix: true  是否不可关闭项
 * activeMenu: '/example/list' 高亮路径
 * fileRoute: '@/views/redirect/index' 文件路径
 */

/**
 * 固定路由
 * 没有权限要求的基页
 * 可以访问所有角色
 */
export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true,
        meta: { title: '登录' }
    },
    {
        path: '/auth-redirect',
        component: () => import('@/views/login/auth-redirect'),
        hidden: true
    },
    {
        path: '/error',
        component: Layout,
        redirect: 'noRedirect',
        name: 'ErrorPages',
        meta: {
            title: '错误页面',
            icon: '404'
        },
        hidden: true,
        children: [
            {
                path: '401',
                component: () => import('@/views/error-page/401'),
                name: 'Page401',
                meta: { title: '401', noCache: true }
            },
            {
                path: '404',
                component: () => import('@/views/error-page/404'),
                name: 'Page404',
                meta: { title: '404', noCache: true }
            }
        ]
    }
]

/**
 * 异步路由
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [

]

export const endRoutes = [

  // 404页必须放在最后！！！
  { path: '*', redirect: '/error/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
