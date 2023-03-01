import Vue from 'vue'

export default function ({ app }) {
  Vue.filter('productImageDefault', (value) => {
    if (!value) return '/images/product/default.png'
    return value
  })

  Vue.filter('productStatus', (value) => {
    let status = ''
    switch (parseInt(value)) {
      case 0:
        status = app.i18n.t('product.status.inactive')
        break
      case 1:
        status = app.i18n.t('product.status.active')
        break
      default:
        break
    }

    return status
  })
}
