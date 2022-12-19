import Cookies from 'js-cookie'

export function getToken(key) {
  return Cookies.get(key, {domain: process.env.VUE_APP_DOMAIN})
}

export function setToken(key, token) {
  return Cookies.set(key, token, {domain: process.env.VUE_APP_DOMAIN})
}

export function removeToken(key) {
  return Cookies.remove(key, {domain: process.env.VUE_APP_DOMAIN})
}
