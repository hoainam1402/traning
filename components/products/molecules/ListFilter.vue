<template>
  <v-row class="ma-1 align-center" dense>
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
      <app-select v-model="filter.status" :items="statuses" :label="$t('order.model.status')" />
    </v-col>
    <v-col cols="12" md="3" sm="4">
      <v-btn outlined @click="$emit('reset')">{{ $t('common.action.reset') }}</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@nuxtjs/composition-api'
import { debounce } from 'lodash'
import AppTextField from '@/components/common/atoms/AppTextField'
import AppSelect from '@/components/common/atoms/AppSelect'

export default defineComponent({
  name: 'ListFilter',
  components: {
    AppTextField,
    AppSelect
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
      { value: root.$t('product.status.inactive'), key: 0 },
      { value: root.$t('product.status.active'), key: 1 }
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
