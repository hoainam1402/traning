export default ($axios) => ({
  async getRoles(params) {
    return await $axios.$get('/admin/roles', {
      params
    })
  },
  async createRole(data) {
    return await $axios.$post('/admin/roles', data)
  },
  async updateRole(id, data) {
    return await $axios.$put(`/admin/roles/${id}`, data)
  },
  async deleteRole(id) {
    return await $axios.$delete(`/admin/roles/${id}`)
  }
})
