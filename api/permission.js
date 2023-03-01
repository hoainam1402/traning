export default ($axios) => ({
  async getPermissions(params) {
    return await $axios.$get('/admin/permissions', {
      params
    })
  },
  async getModulePermissions(params) {
    return await $axios.$get('/admin/module-permissions', {
      params
    })
  }
})
