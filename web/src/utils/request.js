import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['sessionKey'] = getToken('sessionKey')
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if(res.code === 'HL001000000008'){
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    }else{
      return res
    }
    
    // if (res.code == -1 || res.code == -2) {
    //   console.log(res.msg)

    //   if(res.code == -1){
    //     MessageBox.confirm('登录失效或无权限，您可以取消以停留在此页面，或重新登录', '系统提醒', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //     })
    //   }
    //   if(res.code == -2){
    //     MessageBox.alert('系统维护中，请稍后使用', '系统提醒', {
    //       confirmButtonText: '确定',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.msg || 'Error'))
    // } else {
    //   // Message({
    //   //   message: res.msg,
    //   //   type: 'success',
    //   //   duration: 5 * 1000
    //   // })
    //   return res
    // }
  },
  error => {
    // console.log('err', error.response.data) // for debug
    Message({
      message: error.response.data.msg,
      type: 'error',
      duration: 5 * 1000
    })
    if(error.response.data.code === 'HL001000000008'){
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    }
    return Promise.reject(error.response)
  }
)

export default service
