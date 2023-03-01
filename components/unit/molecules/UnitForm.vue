<template>
  <v-row dense>
    <v-col class="text-h5 pa-1 black--text" cols="12">{{ $t('unit.action.createUnit') }}</v-col>
    <v-divider />
    <v-col class="py-0 pr-0" cols="12">
      <app-text-field
        v-model="form.name"
        :errors="errors.name"
        :label="$t('unit.model.name')"
        required
        rules="required|max:20"
      />
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import AppTextField from '@/components/common/atoms/AppTextField'

export default defineComponent({
  name: 'UnitForm',
  components: {
    AppTextField
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      default: () => ({})
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
