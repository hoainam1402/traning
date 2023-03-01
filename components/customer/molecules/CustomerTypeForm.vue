<template>
  <v-row dense>
    <v-col class="text-h5 pa-1 black--text" cols="12">{{ $t('customerType.action.createCustomerType') }}</v-col>
    <v-divider />
    <v-col class="py-0 pr-0" cols="12">
      <app-text-field v-model="form.name" :label="$t('customerType.model.name')" rules="required|max:20" />
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import AppTextField from '@/components/common/atoms/AppTextField'

export default defineComponent({
  name: 'CustomerTypeForm',
  components: { AppTextField },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    return {
      form
    }
  }
})
</script>
