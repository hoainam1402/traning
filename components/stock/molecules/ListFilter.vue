<template>
  <v-row class="ma-1" dense>
    <v-col cols="12" md="3" sm="4">
      <app-date-picker
        v-model="filter.importedFrom"
        class="mt-2"
        clearable
        :label="$t('common.filter.createdFrom')"
        :max-date="filter.importedTo"
      />
    </v-col>
    <v-col cols="12" md="3" sm="4">
      <app-date-picker
        v-model="filter.importedTo"
        clearable
        :label="$t('common.filter.createdTo')"
        :min-date="filter.importedFrom"
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
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { debounce } from 'lodash'
import AppTextField from '@/components/common/atoms/AppTextField'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'

export default defineComponent({
  name: 'ListFilter',
  components: {
    AppDatePicker,
    AppTextField
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
