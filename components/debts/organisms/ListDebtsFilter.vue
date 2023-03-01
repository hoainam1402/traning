<template>
  <v-row class="ma-1 align-end" dense>
    <v-col cols="12" md="3" sm="4">
      <app-date-picker
        v-model="filter.deliveredFrom"
        clearable
        :label="$t('common.filter.createdFrom')"
        :max-date="filter.deliveredTo"
      />
    </v-col>
    <v-col cols="12" md="3" sm="4">
      <app-date-picker
        v-model="filter.deliveredTo"
        clearable
        :label="$t('common.filter.createdTo')"
        :min-date="filter.deliveredFrom"
      />
    </v-col>
    <v-col cols="12" md="4" sm="4">
      <customers-autocomplete v-model="filter.id" :label="$t('customer.title')" />
    </v-col>
    <v-col class="ma-auto">
      <v-btn outlined @click="$emit('reset')">{{ $t('common.action.reset') }}</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'
import CustomersAutocomplete from '@/components/order/atoms/CustomersAutocomplete'

export default defineComponent({
  name: 'ListDebtsFilter',
  components: {
    AppDatePicker,
    CustomersAutocomplete
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

    return {
      filter
    }
  }
})
</script>
