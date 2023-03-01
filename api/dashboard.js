export default ($axios) => ({
  async getProfitAndRevenue(params) {
    return await $axios.$get('/admin/net-profit-and-revenue', { params })
  },
  async getRevenues(params) {
    return await $axios.$get('/admin/revenue', { params })
  },
  async getBirthdayOfCustomers(params) {
    return await $axios.$get('/admin/birthday-of-customer', { params })
  },
  async getProducts(params) {
    return await $axios.$get('/admin/product', { params })
  },
  async getSalesAndOrders(params) {
    return await $axios.$get('/admin/sales-and-orders', { params })
  },
  async getRecentOrders(params) {
    return await $axios.$get('/admin/recent-orders', { params })
  },
  async getOutOfProducts(params) {
    return await $axios.$get('/admin/out-of-products', { params })
  }
})
