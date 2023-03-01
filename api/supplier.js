export default ($axios) => ({
  async getSuppliers(params) {
    return await $axios.$get('/admin/suppliers', {
      params
    })
  },
  async createSupplier(data) {
    return await $axios.$post('/admin/suppliers', data)
  },
  async updateSupplier(id, data) {
    return await $axios.$put(`/admin/suppliers/${id}`, data)
  },
  async deleteSupplier(id) {
    return await $axios.$delete(`/admin/suppliers/${id}`)
  },
  async bulkDeleteSuppliers(data) {
    return await $axios.$delete('/admin/suppliers-bulk-destroy', { data })
  },
  async getProductOfSuppliers(id, params) {
    return await $axios.$get(`/admin/product-of-suppliers/${id}`, {
      params
    })
  }
})
