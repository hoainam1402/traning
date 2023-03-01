export default ($axios) => ({
  async getStocks(params) {
    return await $axios.$get('/admin/stocks', { params })
  },
  async createStock(data) {
    return await $axios.$post('/admin/stocks', data)
  },
  async getStock(id) {
    return await $axios.$get(`/admin/stocks/${id}`)
  },
  async updateStock(id, data) {
    return await $axios.$put(`/admin/stocks/${id}`, data)
  }
})
