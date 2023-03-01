<template>
  <v-row class="ma-1" dense>
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
      <role-select v-model="filter.roles" :label="$t('user.model.roles')" multiple />
    </v-col>
    <v-col cols="12" md="3" sm="4">
      <v-btn outlined @click="$emit('reset')">{{ $t('common.action.reset') }}</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { debounce } from 'lodash'
import RoleSelect from '@/components/users/atoms/RoleSelect'
import AppTextField from '@/components/common/atoms/AppTextField'

export default defineComponent({
  name: 'ListFilter',
  components: {
    AppTextField,
    RoleSelect
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
