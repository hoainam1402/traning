<template>
  <div class="tw-w-full">
    <v-card>
      <div class="justify-space-between align-center pa-2">
        <h3>{{ $t('debts.model.debtsDetail') }}</h3>
        <div class="d-flex align-center">
          <debt-detail-filter v-model="filter" @filter="fetchData" @reset="resetFilter" />
          <v-btn class="mr-2" color="primary" @click="updatePaid">
            {{ $t('debts.action.updatePaid') }}
          </v-btn>
          <v-btn outlined :to="{ name: 'debts' }">
            <v-icon left small>mdi-arrow-left</v-icon>
            {{ $t('common.action.back') }}
          </v-btn>
        </div>
      </div>
    </v-card>

    <total-debts-detail :total-all-debts="totalAllDebts" />

    <v-card>
      <v-divider class="my-1" />
      <app-data-table
        v-model="selectedItems"
        class="flex-grow-1"
        group-by="Tháng"
        :headers="headers"
        item-key="id"
        :items="debt"
        :loading="loading"
        must-sort
        show-group-by
        show-select
      >
        <template #top>
          <div class="d-flex align-center mx-2">
            <v-menu left offset-y>
              <template #item.deliveryDate="{ item }">
                <span>{{ item.deliveryDate | formatDate('MM-YYYY') }}</span>
              </template>
              <template #activator="{ on }">
                <transition mode="out-in" name="slide-fade">
                  <v-btn v-show="selectedItems.length" v-on="on">
                    {{ $t('common.action.choose') }}
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </transition>
              </template>
              <v-list>
                <v-list-item dense @click="bulkPays">
                  <v-list-item-icon>
                    <v-icon color="error" small>mdi-account-credit-card-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ $t('common.action.pay') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-spacer />
          </div>
        </template>
        <template #item.index="{ index }">
          <div>{{ index + 1 }}</div>
        </template>
        <template #item.customer="{ item }">
          <div>{{ item.customer.name }}</div>
        </template>
        <template #item.deliveryAddress="{ item }">
          <v-tooltip color="primary" top>
            <template #activator="{ on, attrs }">
              <span class="d-inline-block text-truncate" style="max-width: 150px" v-bind="attrs" v-on="on">
                {{ item.deliveryAddress }}
              </span>
            </template>
            <span>
              {{ item.deliveryAddress }}
            </span>
          </v-tooltip>
        </template>
        <template #item.totalPrice="{ item }">
          <div>{{ item.totalPrice | currency }}</div>
        </template>
        <template #item.totalShell="{ item }">
          <v-chip small>{{ item.totalShell }}</v-chip>
        </template>
        <template #item.totalResidualGas="{ item }">
          <v-chip small>{{ item.totalResidualGas }}</v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip class="white--text" :color="item.status | orderStatusColor" label small>
            {{ item.status | orderStatus }}
          </v-chip>
        </template>
        <template #item.note="{ item }">
          <v-tooltip color="primary" top>
            <template #activator="{ on, attrs }">
              <span class="d-inline-block text-truncate" style="max-width: 150px" v-bind="attrs" v-on="on">
                {{ item.note }}
              </span>
            </template>
            <span>
              {{ item.note }}
            </span>
          </v-tooltip>
        </template>
        <template #item.action="{ item }">
          <v-btn color="accent" icon small :to="{ name: 'orders-id', params: { id: item.id } }">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </app-data-table>
    </v-card>
    <update-paid-dialog ref="updatePaidDialog" @updated-paid="resetFilter" />
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import { map } from 'lodash'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import UpdatePaidDialog from '@/components/debts/molecules/UpdatePaidDialog'
import TotalDebtsDetail from '@/components/debts/molecules/TotalDebtsDetail'
import DebtDetailFilter from '@/components/debts/organisms/DebtDetailFilter'

export default defineComponent({
  components: {
    AppDataTable,
    UpdatePaidDialog,
    TotalDebtsDetail,
    DebtDetailFilter
  },
  setup(_, { root, refs }) {
    const { $api, params, $dialog, $toast, $moment } = useContext()
    const route = useRoute()
    const routeQuery = route.value.query
    const loading = ref(false)
    const state = reactive({
      filter: Object.assign({
        deliveredFrom: routeQuery.deliveredFrom ? $moment(routeQuery.deliveredFrom).format('YYYY-MM-DD') : '',
        deliveredTo: routeQuery.deliveredTo ? $moment(routeQuery.deliveredTo).format('YYYY-MM-DD') : ''
      }),
      debt: [],
      totalAllDebts: {
        totalDebts: null,
        totalPaid: null,
        remainDebts: null,
        totalShellDebts: null
      },
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false, groupable: false },
        { text: root.$t('debts.model.deliveryDate'), value: 'deliveryDate' },
        { text: root.$t('debts.model.customerName'), value: 'customer', sortable: false, groupable: false },
        { text: root.$t('debts.model.deliveryAddress'), value: 'deliveryAddress', sortable: false, groupable: false },
        { text: root.$t('debts.model.totalPrice'), value: 'totalPrice', groupable: false },
        { text: root.$t('debts.model.totalShell'), value: 'totalShell', groupable: false },
        { text: root.$t('debts.model.totalResidualGas'), value: 'totalResidualGas', groupable: false },
        { text: root.$t('debts.model.note'), value: 'note', sortable: false, groupable: false },
        { text: '', value: 'action', align: 'right', sortable: false, groupable: false }
      ],
      selectedItems: []
    })

    onMounted(() => {
      fetchData()
    })

    const fetchData = async () => {
      loading.value = true
      try {
        const { data } = await $api.debt.getDebt(params.value.id, state.filter)
        state.debt = data.debts
        state.totalAllDebts.totalDebts = data.totalDebts
        state.totalAllDebts.totalPaid = data.totalPaid
        state.totalAllDebts.remainDebts = data.remainDebts
        state.totalAllDebts.totalShellDebts = data.totalShellDebts
        state.debt.forEach((el) => {
          el['Tháng'] = $moment(el.deliveryDate).format('MM-YYYY')
        })
        loading.value = false
      } catch (e) {
        router.push({ name: 'debts' })
      }
    }

    const bulkPays = () => {
      $dialog
        .warning({
          title: root.$t('common.message.confirmTitle'),
          text: root.$t('common.message.confirmDeletionMessage'),
          type: 'warning',
          actions: {
            false: root.$t('common.action.cancel'),
            true: root.$t('common.action.confirm')
          }
        })
        .then((confirm) => {
          if (confirm) {
            $api.debt.bulkPays({ ids: map(state.selectedItems, 'id') }).then(() => {
              $toast.success(root.$t('common.notice.success'))
              fetchData()
              execute()
              state.selectedItems = []
            })
          }
        })
    }

    const updatePaid = () => {
      refs.updatePaidDialog.open()
    }

    const resetFilter = () => {
      state.filter.deliveredFrom = null
      state.filter.deliveredTo = null
      fetchData()
    }

    return {
      filter: toRef(state, 'filter'),
      debt: toRef(state, 'debt'),
      totalAllDebts: toRef(state, 'totalAllDebts'),
      headers: toRef(state, 'headers'),
      selectedItems: toRef(state, 'selectedItems'),
      loading,
      bulkPays,
      updatePaid,
      fetchData,
      resetFilter
    }
  }
})
</script>
