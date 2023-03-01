export default ($axios) => ({
  async getProducts(params) {
    return await $axios.$get('/admin/products', { params })
  },
  async createProduct(data) {
    return await $axios.$post('/admin/products', data)
  },
  async getProduct(id) {
    return await $axios.$get(`/admin/products/${id}`)
  },
  async updateProduct(id, data) {
    return await $axios.$post(`/admin/products/${id}`, data)
  },
  async deleteProduct(id) {
    return await $axios.$delete(`/admin/products/${id}`)
  },
  async bulkDeleteProducts(data) {
    return await $axios.$delete('admin/products-bulk-destroy', { data })
  },
  async updateStatus(id, data) {
    return await $axios.$put(`/admin/products/${id}/status`, data)
  },
  async bulkActiveProducts(data) {
    return await $axios.$put('admin/products-bulk-active', data)
  },
  async bulkInactiveProducts(data) {
    return await $axios.$put('admin/products-bulk-inactive', data)
  }
})
