import Vue from 'vue'
import { ValidationObserver, ValidationProvider, extend, configure } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

/* eslint-disable */
Object.keys(rules).forEach((item) => {
  extend(item, {
    ...rules[item]
  })
})
/* eslint-enable */

export default function ({ app }) {
  configure({
    defaultMessage: (_, values) => app.i18n.t(`validations.${values._rule_}`, values)
  })
}
