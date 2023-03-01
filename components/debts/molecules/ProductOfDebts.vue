<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <app-text-field
          v-model="searchInput"
          append-icon="mdi-magnify"
          clearable
          :placeholder="$t('common.filter.search')"
          @input="handleSearchInput"
        />
      </v-col>
    </v-row>
    <app-data-table class="flex-grow-1" :headers="headers" :items="items" :items-per-page="10" :loading="loading">
      <template #item.index="{ index }">
        <div>{{ index + 1 }}</div>
      </template>
      <template #item.shellDebts="{ item }">
        <v-chip small>{{ item.shellDebts }}</v-chip>
      </template>
    </app-data-table>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import { debounce } from 'lodash'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import AppTextField from '@/components/common/atoms/AppTextField'

export default defineComponent({
  components: {
    AppDataTable,
    AppTextField
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    dialog: {
      type: Boolean,
      default: () => false
    },
    filter: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root }) {
    const { $api } = useContext()
    const loading = ref(false)
    const searchInput = ref('')
    const state = reactive({
      headers: [
        { text: root.$t('common.model.id'), value: 'index' },
        { text: root.$t('common.model.name'), value: 'name' },
        { text: root.$t('product.model.size'), value: 'size' },
        { text: root.$t('orderItem.model.shellDebts'), value: 'shellDebts' }
      ],
      items: []
    })

    const handleSearchInput = debounce(function (val) {
      fetchData(val)
    }, 250)

    const fetchData = async (keyword = '') => {
      loading.value = true
      try {
        const { data } = await $api.customer.getProductOfDebts(props.id, {
          q: keyword,
          deliveredFrom: props.filter.deliveredFrom,
          deliveredTo: props.filter.deliveredTo
        })
        state.items = data
      } catch (e) {
        window.console.error(e)
      }
      loading.value = false
    }

    watch(
      () => props.id,
      () => {
        fetchData()
      },
      {
        immediate: true
      }
    )

    watch(
      () => props.dialog,
      () => {
        if (props.dialog) {
          searchInput.value = ''
        }
      }
    )

    return {
      loading,
      searchInput,
      headers: toRef(state, 'headers'),
      items: toRef(state, 'items'),
      handleSearchInput
    }
  }
})
</script>
