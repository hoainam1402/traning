export default ($axios) => ({
  async getQuotations(params) {
    return await $axios.$get('admin/quotations', {
      params
    })
  },
  async getDates(params) {
    return await $axios.$get('admin/quotations-date', {
      params
    })
  },
  async getNewQuotations(params) {
    return await $axios.$get('admin/before-create', {
      params
    })
  },
  async getUpdateQuotations(params) {
    return await $axios.$get('admin/before-update', {
      params
    })
  },
  async createQuotations(data) {
    return await $axios.$post('admin/quotations', data)
  },
  async updateQuotations(data) {
    return await $axios.$put('admin/quotations', data)
  }
})
