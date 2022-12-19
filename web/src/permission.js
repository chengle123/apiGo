import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = to.meta.title

  // determine whether the user has logged in
  const hasToken = getToken('sessionKey')
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 确定用户是否已通过selectBdUserByJobCard获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // 注意：角色必须是对象数组！例如：['admin']或，['developer'，'editor']
          const { roles } = await store.dispatch('user/selectBdUserByJobCard')

          // 基于角色生成可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack方法以确保addRoutes是完整的
          // 设置replace:true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
          next({
            fullPath: accessRoutes[0].redirect,
            path: accessRoutes[0].redirect,
            replace: true
          })
        } catch (error) {
          // 删除令牌并转到登录页以重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || '有错误')
          next(`/login?redirect=${to.path}`)

          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)

      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
