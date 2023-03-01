export default ($axios) => ({
  async getCustomers(params) {
    return await $axios.$get('/admin/customers', {
      params
    })
  },
  async createCustomer(data) {
    return await $axios.$post('/admin/customers', data)
  },
  async updateCustomer(id, data) {
    return await $axios.$put(`/admin/customers/${id}`, data)
  },
  async deleteCustomer(id) {
    return await $axios.$delete(`/admin/customers/${id}`)
  },
  async bulkDeleteCustomer(data) {
    return await $axios.$delete('/admin/customers-bulk-destroy', { data })
  },
  async getProductOfCustomers(id, params) {
    return await $axios.$get(`/admin/product-of-customers/${id}`, {
      params
    })
  },
  async getProductOfDebts(id, params) {
    return await $axios.$get(`/admin/product-of-debts/${id}`, {
      params
    })
  }
})
