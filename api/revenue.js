export default ($axios) => ({
  async getRevenue(params) {
    return await $axios.$get('/admin/revenue-of-customers', { params })
  }
})
