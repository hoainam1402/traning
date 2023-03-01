export default ($axios) => ({
  async getUsers(params) {
    return await $axios.$get('/admin/users', { params })
  },
  async createUser(data) {
    return await $axios.$post('/admin/users', data)
  },
  async getUser(id) {
    return await $axios.$get(`/admin/users/${id}`)
  },
  async updateUser(id, data) {
    return await $axios.$put(`/admin/users/${id}`, data)
  },
  async deleteUser(id) {
    return await $axios.$delete(`/admin/users/${id}`)
  },
  async bulkDeleteUsers(data) {
    return await $axios.$delete('/admin/users-bulk-destroy', { data })
  },
  async updateRoles(id, data) {
    return await $axios.$post(`/admin/users/${id}/roles`, data)
  },
  async changePassword(id, data) {
    return await $axios.$put(`/admin/users/${id}/password`, data)
  }
})
