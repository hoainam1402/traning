<template>
  <div class="d-flex flex-column flex-grow-1 tw-gap-3">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('debts.title') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
    </div>
    <v-card>
      <list-debts-filter v-model="conditions" @reset="resetFilter" />
      <v-divider class="my-1" />
      <app-data-table
        v-model="selectedItems"
        class="flex-grow-1"
        :headers="headers"
        :items="items"
        :items-per-page.sync="itemsPerPage"
        :loading="isFetching"
        must-sort
        :page.sync="page"
        :server-items-length="totalItem"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        @update:sort-by="onUpdateSort"
        @update:sort-desc="onUpdateSort"
      >
        <template #top>
          <div class="d-flex align-center mx-2">
            <v-spacer />
            <v-btn icon :loading="isFetching" @click="execute">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </div>
        </template>
        <template #item.index="{ index }">
          <span>{{ index + 1 }}</span>
        </template>
        <template #item.totalResidualGas="{ item }">
          <v-chip small>
            {{ item.totalResidualGas }}
          </v-chip>
        </template>
        <template #item.totalShellDebts="{ item }">
          <v-chip class="text-decoration-underline" small @click="viewShellDebts(item)">
            {{ item.totalShellDebts }}
          </v-chip>
        </template>
        <template #item.totalPrice="{ item }">
          <div>{{ item.totalPrice | currency }}</div>
        </template>
        <template #item.action="{ item }">
          <v-btn
            color="success"
            :href="`${$config.apiUrl}/admin/debts/export/${item.id}?deliveredFrom=${conditions.deliveredFrom}&deliveredTo=${conditions.deliveredTo}`"
            icon
            small
            target="_blank"
          >
            <v-icon small>mdi-download</v-icon>
          </v-btn>
          <v-btn
            color="accent"
            icon
            small
            :to="{
              name: 'debts-id',
              params: { id: item.id },
              query: { deliveredFrom: conditions.deliveredFrom, deliveredTo: conditions.deliveredTo }
            }"
          >
            <v-icon>mdi-eye-outline</v-icon>
          </v-btn>
        </template>
      </app-data-table>
    </v-card>
    <detail-total-shell-debts ref="viewShellDebts" :filter="conditions" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import ListDebtsFilter from '@/components/debts/organisms/ListDebtsFilter'
import { useGetDebts } from '@/composables'
import DetailTotalShellDebts from '@/components/debts/organisms/DetailTotalShellDebts'

export default defineComponent({
  components: {
    Breadcrumbs,
    AppDataTable,
    ListDebtsFilter,
    DetailTotalShellDebts
  },
  setup(_, { root, refs }) {
    const { $moment } = useContext()
    const route = useRoute()
    const routeQuery = route.value.query
    const search = ref(routeQuery.q)
    const sortBy = ref(routeQuery.order || 'createdAt')
    const sortDesc = ref(routeQuery.orderDir ? routeQuery.orderDir === 'desc' : true)
    const state = reactive({
      filter: Object.assign({
        q: search,
        order: sortBy.value,
        orderDir: sortDesc.value ? 'desc' : 'asc',
        id: routeQuery.id,
        deliveredFrom: routeQuery.deliveredFrom ? $moment(routeQuery.deliveredFrom).format() : '',
        deliveredTo: routeQuery.deliveredTo ? $moment(routeQuery.deliveredTo).format() : ''
      }),
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false },
        { text: root.$t('debts.model.customerName'), value: 'name' },
        { text: root.$t('debts.model.totalResidualGas'), value: 'totalResidualGas' },
        { text: root.$t('debts.model.totalShellDebts'), value: 'totalShellDebts' },
        { text: root.$t('debts.model.totalDebts'), value: 'totalPrice' },
        { text: '', value: 'action', align: 'right', sortable: false }
      ],
      selectedItems: []
    })

    const {
      state: listState,
      conditions,
      isFetching,
      execute,
      resetConditions,
      page,
      itemsPerPage
    } = useGetDebts(state.filter)

    const onUpdateSort = () => {
      conditions.order = sortBy.value
      conditions.orderDir = sortDesc.value ? 'desc' : 'asc'
    }

    const resetFilter = () => {
      state.filter.id = null
      state.filter.deliveredFrom = null
      state.filter.deliveredTo = null
      resetConditions(state.filter)
    }

    const viewShellDebts = (item) => {
      refs.viewShellDebts.open(item)
    }

    return {
      search,
      sortBy,
      sortDesc,
      filter: toRef(state, 'filter'),
      headers: toRef(state, 'headers'),
      selectedItems: toRef(state, 'selectedItems'),
      items: toRef(listState, 'items'),
      totalItem: toRef(listState, 'totalItem'),
      conditions,
      isFetching,
      execute,
      page,
      itemsPerPage,
      onUpdateSort,
      resetFilter,
      viewShellDebts
    }
  }
})
</script>
