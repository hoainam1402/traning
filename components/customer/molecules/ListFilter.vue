<template>
  <div>
    <v-row class="ma-1 align-end" dense>
      <v-col cols="12" md="3" sm="6">
        <h4 class="mb-1">{{ $t('common.filter.search') }}:</h4>
        <app-text-field
          v-model="search"
          append-icon="mdi-magnify"
          clearable
          :placeholder="$t('common.filter.search')"
          @input="handleSearchInput"
        />
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <customer-type-autocomplete
          v-model="filter.customerTypeId"
          chips
          deletable-chips
          :label="$t('customer.model.type')"
          multiple
        />
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <h4 class="mb-1">{{ $t('common.model.dateOfBirth') }}:</h4>
        <app-date-picker
          v-model="filter.dateOfBirthFrom"
          class="mt-2"
          clearable
          :label="$t('common.filter.createdFrom')"
          :max-date="filter.dateOfBirthTo"
        />
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <app-date-picker
          v-model="filter.dateOfBirthTo"
          clearable
          :label="$t('common.filter.createdTo')"
          :min-date="filter.dateOfBirthFrom"
        />
      </v-col>
      <v-col cols="12" md="2" sm="4">
        <v-btn outlined @click="$emit('reset')">{{ $t('common.action.reset') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { debounce } from 'lodash'
import AppTextField from '@/components/common/atoms/AppTextField'
import CustomerTypeAutocomplete from '@/components/customer/molecules/CustomerTypeAutocomplete'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'

export default defineComponent({
  name: 'ListFilter',
  components: {
    AppTextField,
    CustomerTypeAutocomplete,
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

    const search = ref(filter.value.q)
    watch(
      () => filter.value.q,
      (val) => {
        search.value = val
      }
    )

    const handleSearchInput = debounce(function (val) {
      filter.value.q = val
    }, 250)

    return {
      filter,
      search,
      handleSearchInput
    }
  }
})
</script>
