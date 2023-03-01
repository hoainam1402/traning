export default ($axios) => ({
  async changePassword(data) {
    return await $axios.$put('/admin/auth/change-password', data)
  }
})
