import {
  login,
  logout,
  selectBdUserByJobCard,
  // updateUserPassword,
  // updateUserPasswordIdentify
} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import md5 from 'blueimp-md5'
import { Base64 } from 'js-base64'

const state = {
  token: getToken('sessionKey'),
  name: '',
  roles: [],
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const tenantFlag = 'HIC'
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        userName,
        passWord: Base64.encode(`${tenantFlag}-${md5(password)}`),
        // identifyCode,
        applicationFlag: 'HIC',
        tenantFlag: tenantFlag
      }).then(response => {
        const { data } = response
        // console.log(data)
        commit('SET_TOKEN', data)
        setToken('sessionKey', data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取登录用户信息
  selectBdUserByJobCard({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      selectBdUserByJobCard(state.token).then(response => {
        const { data } = response

        // var data = {
        //   roles: ['admin'],
        // }
        if (!data) {
          reject('验证失败，请重新登录。')
        }

        // const roles = [data.professionCode]
        const roles = ['admin']
        // 角色必须是非空数组
        if (!roles || roles.length <= 0) {
          reject('getInfo:角色必须是非空数组！')
        }

        commit('SET_ROLES', roles)
        commit('SET_USER_INFO', data)
        dispatch('app/setUserOrg', data.professionCode, { root: true })

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 登出
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken('sessionKey')
        resetRouter()

        // 重置访问的视图和缓存的视图
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除cookie
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken('sessionKey')
      resolve()
    })
  },

  // // 修改密码
  // updateUserPassword({ commit }, param) {
  //   const { type, password, identifyCode } = param
  //   return new Promise((resolve, reject) => {
  //     updateUserPassword({
  //       type,
  //       password,
  //       identifyCode
  //     }).then(response => {
  //       const { data } = response
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // // 修改密码验证码
  // updateUserPasswordIdentify({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     updateUserPasswordIdentify().then(response => {
  //       const { data } = response
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // }

  // 动态修改权限
  // async changeRoles({ commit, dispatch }, role) {
  //   const token = role + '-token'

  //   commit('SET_TOKEN', token)
  //   setToken(token)

  //   const { roles } = await dispatch('getInfo')

  //   resetRouter()

  //   // generate accessible routes map based on roles
  //   const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
  //   // dynamically add accessible routes
  //   router.addRoutes(accessRoutes)

  //   // reset visited views and cached views
  //   dispatch('tagsView/delAllViews', null, { root: true })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
