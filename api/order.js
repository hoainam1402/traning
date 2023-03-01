export default ($axios) => ({
  async getOrders(params) {
    return await $axios.$get('/admin/orders', {
      params
    })
  },
  async createOrder(data) {
    return await $axios.$post('/admin/orders', data)
  },
  async getOrder(id) {
    return await $axios.$get(`/admin/orders/${id}`)
  },
  async updateOrder(id, data) {
    return await $axios.$put(`/admin/orders/${id}`, data)
  },
  async deleteOrder(id) {
    return await $axios.$delete(`/admin/orders/${id}`)
  },
  async bulkDeleteOrders(data) {
    return await $axios.$delete('/admin/orders-bulk-destroy', { data })
  },
  async cancelOrder(id) {
    return await $axios.$put(`/admin/orders/${id}/cancel`)
  }
})
