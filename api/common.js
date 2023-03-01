export default ($axios) => ({
  async searchCustomers(params) {
    return await $axios.$get('/admin/search-customers', {
      params
    })
  },
  async searchProducts(params) {
    return await $axios.$get('/admin/search-products', {
      params
    })
  },
  async searchCustomerProducts(id, params) {
    return await $axios.$get(`/admin/customer/${id}/search-products`, {
      params
    })
  },
  async searchAddresses(id, params) {
    return await $axios.$get(`/admin/customer/${id}/search-addresses`, {
      params
    })
  },
  async searchSuppliers(id, params) {
    return await $axios.$get(`/admin/product/${id}/search-suppliers`, {
      params
    })
  }
})
