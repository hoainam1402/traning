export default ($axios) => ({
  async getCustomerType(params) {
    return await $axios.$get('/admin/customer-types', {
      params
    })
  },
  async createCustomerType(data) {
    return await $axios.$post('/admin/customer-types', data)
  },
  async updateCustomerType(id, data) {
    return await $axios.$put(`/admin/customer-types/${id}`, data)
  },
  async deleteCustomerType(id) {
    return await $axios.$delete(`/admin/customer-types/${id}`)
  },
  async bulkDeleteCustomerType(data) {
    return await $axios.$delete('/admin/customer-types-bulk-destroy', { data })
  }
})
