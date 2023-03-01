<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('order.title') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn v-if="$acl.permission('orders.create')" color="primary" :to="{ name: 'orders-create' }">
        {{ $t('order.action.createOrder') }}
      </v-btn>
    </div>
    <v-card>
      <list-order-filter v-model="conditions" @reset="resetFilter" />
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
        :show-select="$acl.permission('orders.delete') && !conditions.deleted"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        @update:sort-by="onUpdateSort"
        @update:sort-desc="onUpdateSort"
      >
        <template #top>
          <div class="d-flex align-center mx-2">
            <v-menu left offset-y>
              <template #activator="{ on }">
                <transition mode="out-in" name="slide-fade">
                  <v-btn v-show="selectedItems.length" v-on="on">
                    {{ $t('common.action.choose') }}
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </transition>
              </template>
              <v-list>
                <v-list-item dense @click="bulkDeleteOrders">
                  <v-list-item-icon>
                    <v-icon color="error" small>mdi-delete-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ $t('common.action.delete') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-spacer />
            <v-btn icon :loading="isFetching" @click="execute">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </div>
        </template>
        <template #item.index="{ index }">
          <div>{{ index + 1 }}</div>
        </template>
        <template #item.createdAt="{ item }">
          <div>{{ item.createdAt | formatDate }}</div>
        </template>
        <template #item.deliveryDate="{ item }">
          <div>{{ item.deliveryDate | formatDate }}</div>
        </template>
        <template #item.customer="{ item }">
          <div>{{ item.customer.name }}</div>
        </template>
        <template #item.deliveryAddress="{ item }">
          <span class="d-inline-block">
            {{ item.deliveryAddress }}
          </span>
        </template>
        <template #item.status="{ item }">
          <v-chip class="white--text" :color="item.status | orderStatusColor" label small>
            {{ item.status | orderStatus }}
          </v-chip>
        </template>
        <template #item.note="{ item }">
          <span class="d-inline-block">
            {{ item.note }}
          </span>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            v-if="$acl.permission('orders.edit') && item.status === 'new'"
            color="error"
            icon
            small
            @click="cancelOrder(item.id)"
          >
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
          <v-btn
            v-if="$acl.permission('orders.view')"
            color="accent"
            icon
            small
            :to="{ name: 'orders-id', params: { id: item.id } }"
          >
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            v-if="$acl.permission('orders.edit') && item.status !== 'cancelled'"
            color="info"
            icon
            small
            :to="{ name: 'orders-edit-id', params: { id: item.id } }"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="$acl.permission('orders.delete') && item.status !== 'delivered'"
            color="error"
            icon
            small
            @click="deleteOrder(item.id)"
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </template>
      </app-data-table>
    </v-card>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import { map } from 'lodash'
import { useGetOrders } from '@/composables'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import ListOrderFilter from '@/components/order/ListOrderFilter'

export default defineComponent({
  components: {
    Breadcrumbs,
    ListOrderFilter,
    AppDataTable
  },
  setup(_, { root }) {
    const { $api, $toast, $dialog, $moment } = useContext()

    const route = useRoute()
    const routeQuery = route.value.query
    const search = ref(routeQuery.q)
    const sortBy = ref(routeQuery.order || 'createdAt')
    const sortDesc = ref(routeQuery.orderDir ? routeQuery.orderDir === 'DESC' : true)

    const state = reactive({
      filter: Object.assign({
        q: search,
        order: sortBy.value,
        orderDir: sortDesc.value ? 'desc' : 'asc',
        statuses: routeQuery.statuses,
        createdFrom: routeQuery.createdFrom ? $moment(routeQuery.createdFrom).format() : '',
        createdTo: routeQuery.createdTo ? $moment(routeQuery.createdTo).format() : '',
        deliveredFrom: routeQuery.deliveredFrom ? $moment(routeQuery.deliveredFrom).format() : '',
        deliveredTo: routeQuery.deliveredTo ? $moment(routeQuery.deliveredTo).format() : ''
      }),
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false },
        { text: root.$t('common.model.createdAt'), value: 'createdAt' },
        { text: root.$t('order.model.deliveryDate'), value: 'deliveryDate' },
        { text: root.$t('order.model.customerName'), value: 'customer', width: '200px', sortable: false },
        { text: root.$t('order.model.deliveryAddress'), value: 'deliveryAddress', width: '200px', sortable: false },
        { text: root.$t('order.model.totalShell'), value: 'totalShell' },
        { text: root.$t('order.model.totalResidualGas'), value: 'totalResidualGas' },
        { text: root.$t('order.model.status'), value: 'status', sortable: false },
        { text: root.$t('order.model.note'), value: 'note', sortable: false },
        { text: '', value: 'actions', align: 'right', sortable: false }
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
    } = useGetOrders(state.filter)

    const onUpdateSort = () => {
      conditions.order = sortBy.value
      conditions.orderDir = sortDesc.value ? 'desc' : 'asc'
    }

    const resetFilter = () => {
      state.filter.q = null
      state.filter.statuses = null
      state.filter.createdFrom = null
      state.filter.createdTo = null
      state.filter.deliveredFrom = null
      state.filter.deliveredTo = null
      resetConditions(state.filter)
    }

    const deleteOrder = (id) => {
      $dialog
        .confirm({
          title: root.$t('common.message.confirmTitle'),
          text: root.$t('common.message.confirmDeletionMessage')
        })
        .then((confirm) => {
          if (confirm) {
            $api.order.deleteOrder(id).then(() => {
              execute()
              $toast.success(root.$t('order.notice.deleteSuccess'))
            })
          }
        })
    }

    const bulkDeleteOrders = () => {
      $dialog
        .warning({
          text: root.$t('common.message.confirmDeletionMessage'),
          title: root.$t('common.message.warning'),
          actions: {
            false: root.$t('common.action.cancel'),
            true: root.$t('common.action.confirm')
          }
        })
        .then((confirm) => {
          if (confirm) {
            $api.order.bulkDeleteOrders({ ids: map(state.selectedItems, 'id') }).then(() => {
              state.selectedItems = []
              execute()
              $toast.success(root.$t('order.notice.deleteSuccess'))
            })
          }
        })
    }

    const cancelOrder = (id) => {
      $dialog
        .confirm({
          title: root.$t('order.message.confirmCancelTitle'),
          text: root.$t('order.message.confirmCancelMessage')
        })
        .then((confirm) => {
          if (confirm) {
            $api.order.cancelOrder(id).then(() => {
              execute()
              $toast.success(root.$t('order.notice.cancelSuccess'))
            })
          }
        })
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
      deleteOrder,
      bulkDeleteOrders,
      cancelOrder
    }
  }
})
</script>
