export default ($axios) => ({
  async getUnits(params) {
    return await $axios.$get('/admin/units', { params })
  },
  async creatUnit(data) {
    return await $axios.$post('/admin/units', data)
  },
  async getUnit(id) {
    return await $axios.$get(`/admin/units/${id}`)
  },
  async updateUnit(data) {
    return await $axios.$put(`/admin/units/${data.id}`, data)
  },
  async deleteUnit(id) {
    return await $axios.$delete(`/admin/units/${id}`)
  },
  async bulkDeleteUnits(data) {
    return await $axios.$delete('/admin/units-bulk-destroy', { data })
  }
})
