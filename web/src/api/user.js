import request from '@/utils/request'
import qs from 'qs'

// 登录
export function login(data) {
  return request({
    url: '/usercs/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取登录用户信息
export function selectBdUserByJobCard() {
  return request({
    url: '/usercs/selectBdUserByJobCard',
    method: 'post'
  })
}

// 登出
export function logout() {
  return request({
    url: '/usercs/logout',
    method: 'post'
  })
}

// 路由
export function selectBdUserResourceList() {
  return request({
    url: '/usercs/selectBdUserResourceList',
    method: 'post'
  })
}
