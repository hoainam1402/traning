<template>
  <v-card height="100%">
    <v-card-title>{{ $t('dashboard.outOfProduct') }}</v-card-title>
    <app-data-table class="flex-grow-1" :headers="headers" hide-default-footer :items="items" :loading="loading">
      <template #item.index="{ index }">
        <div>{{ index + 1 }}</div>
      </template>
      <template #item.amount="{ item }">
        <v-chip color="red" small text-color="white">{{ item.amount }}</v-chip>
      </template>
      <template #item.unit="{ item }">
        <div>{{ item.unit }}</div>
      </template>
    </app-data-table>
  </v-card>
</template>

<script>
import { defineComponent, toRef, reactive, useFetch, useContext, ref } from '@nuxtjs/composition-api'
import AppDataTable from '@/components/common/atoms/AppDataTable'

export default defineComponent({
  name: 'OutOfProductList',
  components: {
    AppDataTable
  },
  setup(_, { root }) {
    const { $api } = useContext()
    const state = reactive({
      headers: [
        { text: root.$t('common.model.id'), value: 'index' },
        { text: root.$t('common.model.name'), value: 'name' },
        { text: root.$t('product.model.size'), value: 'size' },
        { text: root.$t('stock.model.unit'), value: 'unit', sortable: false },
        { text: root.$t('stock.model.currentStock'), value: 'amount' }
      ],
      items: []
    })
    const loading = ref(false)

    useFetch(() => {
      loading.value = true
      $api.dashboard
        .getOutOfProducts()
        .then(({ data }) => {
          state.items = data
        })
        .finally(() => {
          loading.value = false
        })
    })

    return {
      loading,
      headers: toRef(state, 'headers'),
      items: toRef(state, 'items')
    }
  }
})
</script>
