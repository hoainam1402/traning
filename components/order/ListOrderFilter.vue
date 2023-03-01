<template>
  <v-row class="ma-1 align-end" dense>
    <v-col cols="12" md="3" sm="4">
      <h4 class="mb-1">{{ $t('common.model.createdAt') }}:</h4>
      <app-date-picker
        v-model="filter.createdFrom"
        class="mt-2"
        clearable
        :label="$t('common.filter.createdFrom')"
        :max-date="filter.createdTo"
      />
    </v-col>
    <v-col cols="12" md="3" sm="4">
      <app-date-picker
        v-model="filter.createdTo"
        clearable
        :label="$t('common.filter.createdTo')"
        :min-date="filter.createdFrom"
      />
    </v-col>
    <v-col cols="12" md="3" sm="4">
      <h4 class="mb-1">{{ $t('order.model.deliveryDate') }}:</h4>
      <app-date-picker
        v-model="filter.deliveredFrom"
        class="mt-2"
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
    <v-col cols="12" md="3" sm="4">
      <app-select
        v-model="filter.statuses"
        chips
        clearable
        deletable-chips
        :items="statuses"
        :label="$t('order.model.status')"
        multiple
        small-chips
      />
    </v-col>
    <v-col cols="12" md="3" sm="4">
      <app-text-field
        v-model="search"
        append-icon="mdi-magnify"
        clearable
        :placeholder="$t('common.filter.search')"
        @input="handleSearchInput"
      />
    </v-col>
    <v-col cols="12" md="3" sm="4">
      <v-btn outlined @click="$emit('reset')">{{ $t('common.action.reset') }}</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@nuxtjs/composition-api'
import { debounce } from 'lodash'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'
import AppSelect from '@/components/common/atoms/AppSelect'
import AppTextField from '@/components/common/atoms/AppTextField'

export default defineComponent({
  name: 'ListOrderFilter',
  components: {
    AppDatePicker,
    AppSelect,
    AppTextField
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root, emit }) {
    const filter = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const statuses = [
      { value: root.$t('order.status.new'), key: 'new' },
      { value: root.$t('order.status.delivered'), key: 'delivered' },
      { value: root.$t('order.status.cancelled'), key: 'cancelled' }
    ]

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
      statuses,
      search,
      handleSearchInput
    }
  }
})
</script>
