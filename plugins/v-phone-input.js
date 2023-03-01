import Vue from 'vue'
import { createVPhoneInput } from 'v-phone-input'

const vPhoneInput = createVPhoneInput({
  countryIconMode: 'svg'
})

Vue.use(vPhoneInput)
