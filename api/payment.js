export default ($axios) => ({
  async getPayments(id, params) {
    return await $axios.$get(`/admin/customer/${id}/payments`, { params })
  },
  async createPayment(id, data) {
    return await $axios.$post(`/admin/customer/${id}/payments`, data)
  },
  async updatePayment(data) {
    return await $axios.$put(`/admin/payments/${data.id}`, data)
  },
  async deletePayment(id) {
    return await $axios.$delete(`/admin/payments/${id}`)
  },
  async bulkDeletePayments(data) {
    return await $axios.$delete('/admin/payments-bulk-destroy', { data })
  }
})
