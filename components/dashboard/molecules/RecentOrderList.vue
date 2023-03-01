<template>
  <v-card height="100%">
    <v-card-title>{{ $t('dashboard.latestOrder') }}</v-card-title>
    <app-data-table class="flex-grow-1" :headers="headers" hide-default-footer :items="items" :loading="loading">
      <template #item.index="{ index }">
        <div>{{ index + 1 }}</div>
      </template>
      <template #item.totalPrice="{ item }">
        <div>{{ item.totalPrice | currency }}</div>
      </template>
    </app-data-table>
  </v-card>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useFetch } from '@nuxtjs/composition-api'
import AppDataTable from '@/components/common/atoms/AppDataTable'

export default defineComponent({
  name: 'RecentOrderList',
  components: {
    AppDataTable
  },
  setup(_, { root }) {
    const { $api } = useContext()
    const state = reactive({
      headers: [
        { text: root.$t('common.model.id'), value: 'index' },
        { text: root.$t('customer.title'), value: 'customer.name' },
        { text: root.$t('order.model.totalPrice'), value: 'totalPrice' },
        { text: root.$t('order.model.note'), value: 'note', sortable: false }
      ],
      items: []
    })
    const loading = ref(false)

    useFetch(() => {
      loading.value = true
      $api.dashboard
        .getRecentOrders()
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
