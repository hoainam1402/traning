import Vue from 'vue'

export default function ({ app }) {
  Vue.filter('orderStatus', (value) => {
    let status = ''
    switch (value) {
      case 'new':
        status = app.i18n.t('order.status.new')
        break
      case 'delivered':
        status = app.i18n.t('order.status.delivered')
        break
      case 'paid':
        status = app.i18n.t('order.status.paid')
        break
      case 'cancelled':
        status = app.i18n.t('order.status.cancelled')
        break
      default:
        break
    }

    return status
  })

  Vue.filter('orderStatusColor', (value) => {
    let color = ''
    switch (value) {
      case 'new':
        color = 'warning'
        break
      case 'delivered':
        color = 'light-blue'
        break
      case 'paid':
        color = 'green'
        break
      case 'cancelled':
        color = 'error'
        break
      default:
        break
    }

    return color
  })

  Vue.filter('currency', (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  })
}
