const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  userInfo: state => state.user.userInfo,
  userOrg: state => state.app.userOrg,
  menus: state => state.permission.menus,
  leftMenus: state => state.permission.leftMenus,
}
export default getters
