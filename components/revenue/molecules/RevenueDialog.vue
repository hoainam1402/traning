<template>
  <app-dialog v-model="visible" :title="$t('revenue.model.revenueMonth', { _month_: month })" width="800px">
    <v-card flat>
      <app-data-table class="flex-grow-1" :headers="headers" :items="items" :loading="loading" must-sort>
        <template #item.index="{ index }">
          <div>{{ index + 1 }}</div>
        </template>
        <template #item.totalPrice="{ item }">
          <div>{{ item.totalPrice | currency }}</div>
        </template>
      </app-data-table>
      <v-card-actions>
        <v-spacer />
        <v-btn outlined @click="cancel">{{ $t('common.action.cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
  </app-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import AppDialog from '@/components/common/atoms/AppDialog'

export default defineComponent({
  components: {
    AppDialog,
    AppDataTable
  },
  setup(_, { root }) {
    const { $api } = useContext()
    const state = reactive({
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false },
        { text: root.$t('revenue.model.customerName'), value: 'customer.name' },
        { text: root.$t('revenue.model.totalPrice'), value: 'totalPrice' }
      ],
      items: []
    })
    const visible = ref(false)
    const loading = ref(false)
    const month = ref('')

    const open = async (index) => {
      month.value = index + 1
      visible.value = true
      loading.value = true
      try {
        const { data } = await $api.revenue.getRevenue({
          month: month.value
        })
        state.items = data
      } catch (e) {}
      loading.value = false
    }
    const cancel = () => {
      visible.value = false
    }

    return {
      visible,
      loading,
      month,
      headers: toRef(state, 'headers'),
      items: toRef(state, 'items'),
      open,
      cancel
    }
  }
})
</script>
