export default ($axios) => ({
  async getDebts(params) {
    return await $axios.$get('/admin/debts', {
      params
    })
  },
  async getDebt(id, params) {
    return await $axios.$get(`/admin/debts/${id}`, {
      params
    })
  },
  async bulkPays(data) {
    return await $axios.$delete('admin/pays-bulk-destroy', { data })
  }
})
