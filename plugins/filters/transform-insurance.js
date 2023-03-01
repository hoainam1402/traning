import Vue from 'vue'

Vue.filter('transformInsurance', (value) => {
  if (!value) return ''

  return value === '1' ? 'Có' : 'Không'
})
