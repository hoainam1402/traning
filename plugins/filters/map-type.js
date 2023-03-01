import Vue from 'vue'
import { find } from 'lodash'

Vue.filter('mapType', (value, arr) => {
  if (!value === null) return ''

  const type = find(arr || [], (item) => item.key === value)
  if (typeof type === 'object' && type) {
    return type.value
  }

  return value
})
