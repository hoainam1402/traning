<template>
  <v-card outlined width="100%">
    <v-row class="ma-1" dense>
      <v-col class="pl-0" cols="12" sm="6">
        <app-text-field v-model="searchInput" append-icon="mdi-magnify" :placeholder="$t('common.filter.search')" />
      </v-col>
      <v-col class="pl-1" cols="12" sm="2">
        <v-btn outlined @click="searchProduct(searchInput)">{{ $t('common.filter.search') }}</v-btn>
      </v-col>
      <v-col class="pl-2" cols="12" sm="2">
        <v-btn outlined @click="resetSearch">{{ $t('common.action.reset') }}</v-btn>
      </v-col>
    </v-row>
    <app-data-table class="flex-grow-1" :headers="headers" :items="items" :items-per-page="10">
      <template #item.index="{ index }">
        <div>{{ index + 1 }}</div>
      </template>
    </app-data-table>
  </v-card>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import { cloneDeep, isEmpty } from 'lodash'
import AppTextField from '@/components/common/atoms/AppTextField'
import AppDataTable from '@/components/common/atoms/AppDataTable'

export default defineComponent({
  components: {
    AppTextField,
    AppDataTable
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: Number,
      default: null
    },
    drawer: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props, { root }) {
    const loading = ref(false)
    const { $api } = useContext()
    const initialState = () => ({
      headers: [
        { text: root.$t('common.model.id'), value: 'index' },
        { text: root.$t('common.model.name'), value: 'name' },
        { text: root.$t('product.model.size'), value: 'size' }
      ]
    })
    const state = reactive(initialState())
    const items = ref([])
    const fetchData = async (keyword = '') => {
      try {
        const { data } = await $api.customer.getProductOfCustomers(props.id, {
          q: keyword
        })
        items.value = data
      } catch (e) {
        window.console.error(e)
      }
    }
    const searchInput = ref('')

    onMounted(() => {
      if (!isEmpty(props.value)) {
        items.value = [cloneDeep(props.value)]
      }
      fetchData()
    })
    const searchProduct = (search) => {
      fetchData(search)
    }
    const resetSearch = () => {
      searchInput.value = ''
      searchProduct(null)
    }

    watch(
      () => props.drawer,
      () => {
        if (props.drawer) {
          resetSearch()
        }
      }
    )

    return {
      loading,
      headers: toRef(state, 'headers'),
      items,
      searchInput,
      searchProduct,
      resetSearch
    }
  }
})
</script>
