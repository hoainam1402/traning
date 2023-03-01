<template>
  <v-row dense>
    <v-col cols="6" sm="4">
      <app-date-picker
        v-model="filter.deliveredFrom"
        clearable
        :label="$t('common.filter.createdFrom')"
        :max-date="filter.deliveredTo"
      />
    </v-col>
    <v-col cols="6" sm="4">
      <app-date-picker
        v-model="filter.deliveredTo"
        clearable
        :label="$t('common.filter.createdTo')"
        :min-date="filter.deliveredFrom"
      />
    </v-col>
    <v-col class="d-flex align-center tw-gap-1">
      <v-btn outlined @click="$emit('reset')">{{ $t('common.action.reset') }}</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, watch } from '@nuxtjs/composition-api'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'

export default defineComponent({
  name: 'DebtDetailFilter',
  components: {
    AppDatePicker
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const filter = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    watch(
      () => filter,
      () => {
        emit('filter')
      },
      {
        deep: true
      }
    )

    return {
      filter
    }
  }
})
</script>
