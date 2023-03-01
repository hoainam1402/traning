<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('stock.title.stockList') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn color="primary" @click="createStock">
        {{ $t('stock.action.create') }}
      </v-btn>
    </div>
    <v-card>
      <list-filter v-model="conditions" @reset="resetFilter" />
      <v-divider class="my-1" />
      <app-data-table
        class="flex-grow-1"
        :expanded.sync="expanded"
        :headers="headers"
        :items="items"
        :items-per-page.sync="itemsPerPage"
        :loading="isFetching"
        must-sort
        :page.sync="page"
        :server-items-length="totalItem"
        show-expand
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
        <template #item.image="{ item }">
          <div class="d-flex align-center py-1">
            <v-img contain height="52" max-width="52" :src="item.imageUrl | productImageDefault" />
          </div>
        </template>
        <template #item.product="{ item }">
          <span>{{ item.name }}</span>
        </template>
        <template #item.totalActualAmount="{ item }">
          <v-chip small>{{ parseInt(item.totalAmountOrderNew) + parseInt(item.totalAmount) }}</v-chip>
        </template>
        <template #item.totalAmountOrderNew="{ item }">
          <v-chip small>{{ item.totalAmountOrderNew }}</v-chip>
        </template>
        <template #item.totalAmount="{ item }">
          <v-chip small>{{ item.totalAmount }}</v-chip>
        </template>
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-simple-table>
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">{{ $t('stock.model.supplierName') }}</th>
                    <th class="text-left">{{ $t('stock.model.amount') }}</th>
                    <th class="text-left">{{ $t('stock.model.importedAt') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stock in item.stockGrouped" :key="stock.id">
                    <td>
                      {{ stock.name }}
                    </td>
                    <td>
                      <v-chip small>{{ stock.amount }}</v-chip>
                    </td>
                    <td>
                      <span>{{ stock.importedAt | formatDate }}</span>
                    </td>
                    <td>
                      <v-btn color="info" icon small @click="editStock(stock)">
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </td>
        </template>
      </app-data-table>
    </v-card>
    <create-stock ref="createStock" @success="execute" />
    <edit-stock ref="editStock" @success="execute" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useRoute, ref, useContext } from '@nuxtjs/composition-api'
import { useGetStocks } from '@/composables'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import ListFilter from '@/components/stock/molecules/ListFilter'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import CreateStock from '@/components/stock/organisms/CreateStockDrawer'
import EditStock from '@/components/stock/organisms/EditStockDrawer'

export default defineComponent({
  components: {
    Breadcrumbs,
    ListFilter,
    AppDataTable,
    CreateStock,
    EditStock
  },
  setup(_, { root, refs }) {
    const route = useRoute()
    const { $moment } = useContext()
    const routeQuery = route.value.query
    const search = ref(routeQuery.q)
    const sortBy = ref(routeQuery.order || 'createdAt')
    const sortDesc = ref(routeQuery.orderDir ? routeQuery.orderDir === 'desc' : true)
    const state = reactive({
      filter: Object.assign({
        q: search,
        importedFrom: routeQuery.importedFrom ? $moment(routeQuery.importedFrom).format() : '',
        importedTo: routeQuery.importedTo ? $moment(routeQuery.importedTo).format() : ''
      }),
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false, width: '1%' },
        { text: root.$t('product.model.image'), value: 'image', sortable: false, width: '5%' },
        { text: root.$t('stock.model.productName'), value: 'product', width: '35%' },
        { text: root.$t('product.model.size'), value: 'size', width: '10%' },
        { text: root.$t('stock.model.totalActualAmount'), value: 'totalActualAmount', width: '5%' },
        { text: root.$t('stock.model.totalAmountOrderNew'), value: 'totalAmountOrderNew', width: '5%' },
        { text: root.$t('stock.model.amount'), value: 'totalAmount', width: '39%' }
      ],
      expanded: []
    })

    const {
      state: listState,
      conditions,
      isFetching,
      execute,
      resetConditions,
      page,
      itemsPerPage
    } = useGetStocks(state.filter)

    const onUpdateSort = () => {
      conditions.order = sortBy.value
      conditions.orderDir = sortDesc.value ? 'desc' : 'asc'
    }

    const resetFilter = () => {
      state.filter.q = null
      state.filter.importedFrom = null
      state.filter.importedTo = null
      resetConditions(state.filter)
    }

    const createStock = () => {
      refs.createStock.open()
    }

    const editStock = (item) => {
      refs.editStock.open(item)
    }

    return {
      search,
      sortBy,
      sortDesc,
      filter: toRef(state, 'filter'),
      headers: toRef(state, 'headers'),
      expanded: toRef(listState, 'expanded'),
      items: toRef(listState, 'items'),
      totalItem: toRef(listState, 'totalItem'),
      conditions,
      isFetching,
      execute,
      page,
      itemsPerPage,
      onUpdateSort,
      resetFilter,
      createStock,
      editStock
    }
  }
})
</script>
