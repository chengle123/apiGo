import { asyncRoutes, constantRoutes, endRoutes } from '@/router'
import { toTree } from '@/utils/index'
import {
  selectBdUserResourceList
} from '@/api/user'

/**
 * 递归过滤异步路由表
 */
function filterAsyncRoutes(routes, permissionList, permission) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (permissionList.includes(route.name)) {
      if (route.meta) {
        tmp.meta.permission = permission[tmp.name]
      }
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissionList, permission)
      }
      res.push(tmp)
    }
  })
  return res
}

// 筛选线上配置的菜单
function filterMenu(data) {
  let res = {}
  let type = false

  function handleData(data) {
    for (var i = 0; i < data.length; i++) {
      if (type) {
        break
      }
      if (data[i].resourceName === '发布系统') {
        res = data[i]
        type = true
      } else if (data[i].children) {
        handleData(data[i].children)
      }
    }
  }
  handleData(data)
  return res
}

// 对比内容生成
function contrastGenerate(data) {
  let text = ''
  const permission = {}
  function handleData(data, parent) {
    data.map(item => {
      if (item.resourceType === 0) {
        text += ',' + item.resourceAuthority
        if (item.children) {
          handleData(item.children, item.resourceAuthority)
        }
      } else {
        parent.split(',').map(key => {
          if (permission[key]) {
            permission[key][item.redirectUrl] = 1
          } else {
            permission[key] = {}
            permission[key][item.redirectUrl] = 1
          }
        })
      }
    })
  }
  handleData(data.children, data.resourceAuthority)
  return { permissionList: text.split(','), permission: permission }
}

const state = {
  routes: [],
  addRoutes: [],
  menus: [],
  leftMenus: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_LEFT_MENUS: (state, menus) => {
    state.leftMenus = menus
  }
}

const actions = {
  // 用线上配置的菜单过滤
  generateRoutes({ commit, dispatch }, roles) {
    return new Promise(resolve => {
      // selectBdUserResourceList().then(response => {
      //   const { data } = response

      //   let obj = {}

      //   const resultData = toTree(data, 0, 'parentResourceId', 'bdResourceId')
      //   if (Array.isArray(resultData)) {
      //     resultData.map(item => {
      //       // console.log(item)
      //       if (item.useType === 'PC') {
      //         obj = item
      //       }
      //     })
      //   } else {
      //     obj = resultData
      //   }

      //   // 菜单=========================
      //   const newResource = []
      //   const newResourceObj = {}
      //   data.forEach(item => {
      //     if (item.resourceType != 1) {
      //       const newItem = {
      //         parentResourceId: item.parentResourceId,
      //         resourceType: item.resourceType,
      //         orderNumber: item.orderNumber,
      //         bdResourceId: item.bdResourceId,
      //         useType: item.useType,
      //         // meta: { title: item.resourceName, icon: item.labelStyle},
      //         resourceAuthority: item.resourceAuthority,
      //         redirectUrl: item.redirectUrl,
      //         resourceName: item.resourceName,
      //         labelStyle: item.labelStyle
      //       }
      //       if (item.redirectUrl !== ';' && item.resourceType === 0) {
      //         newResourceObj[item.redirectUrl.replace('#/', '/')] = newItem
      //       }
      //       newResource.push(newItem)
      //     }
      //   })

      //   const resourceTree = toTree(newResource, 0, 'parentResourceId', 'bdResourceId')

      //   const newResourcTree = []
      //   // let parentResourceId = ''
      //   // let resourceTreeChildren = []
      //   // for (let i = 0; i < resourceTree.length; i++) {
      //   //   if (resourceTree[i].useType === 'PC') {
      //   //     parentResourceId = resourceTree[i].bdResourceId
      //   //     resourceTreeChildren = resourceTree[i].children
      //   //     break
      //   //   }
      //   // }

      //   // console.log(resourceTree)
      //   // resourceTreeChildren
      //   resourceTree.children.map(item => {
      //     // if (item.parentResourceId === parentResourceId) {
      //     if (item.resourceName === '发布系统') {
      //       newResourcTree.push(item)
      //     }
      //   })
      //   // commit('SET_MENUS', newResourcTree)
      //   commit('SET_LEFT_MENUS', newResourcTree[0].children)
      //   // ========================

      //   let accessedRoutes

      //   const { permissionList, permission } = contrastGenerate(filterMenu([obj]))

      //   accessedRoutes = [...filterAsyncRoutes(asyncRoutes, permissionList, permission), ...endRoutes]

      //   accessedRoutes[0].children[0].meta.affix = true
      //   // console.log(accessedRoutes)
      //   // accessedRoutes = [...asyncRoutes, ...endRoutes]
      //   commit('SET_ROUTES', accessedRoutes)
      //   resolve(accessedRoutes)
      // }).catch(error => {
      //   resolve([])
      //   // reject(error)
      // })
    })
  },
  // 左侧菜单列表
  changeLeftMenu({ commit }, data) {
    commit('SET_LEFT_MENUS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
