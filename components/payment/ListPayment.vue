<template>
  <div>
    <v-divider class="my-1" />
    <v-row class="ma-1 align-end" dense>
      <v-col cols="12" md="4">
        <app-date-picker
          v-model="conditions.paymentFrom"
          clearable
          :label="$t('common.filter.createdFrom')"
          :max-date="conditions.paymentTo"
        />
      </v-col>
      <v-col cols="12" md="4">
        <app-date-picker
          v-model="conditions.paymentTo"
          clearable
          :label="$t('common.filter.createdTo')"
          :min-date="conditions.paymentFrom"
        />
      </v-col>
      <v-col class="ma-auto">
        <v-btn outlined @click="resetFilter">{{ $t('common.action.reset') }}</v-btn>
      </v-col>
    </v-row>
    <v-divider class="my-1" />
    <app-data-table
      v-model="selectedItems"
      class="flex-grow-1"
      :headers="headers"
      :items="items"
      :items-per-page.sync="conditions.limit"
      :loading="loading"
      :page.sync="conditions.page"
      :server-items-length="totalItem"
      show-select
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
              <v-list-item dense @click="bulkDeletePayments">
                <v-list-item-icon>
                  <v-icon color="error" small>mdi-delete-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ $t('common.action.delete') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
      <template #item.index="{ index }">
        <span>{{ index + 1 }}</span>
      </template>
      <template #item.paymentDate="{ item }">
        <div>{{ item.paymentDate }}</div>
      </template>
      <template #item.paid="{ item }">
        <div>{{ item.paid | currency }}</div>
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
        <div class="d-flex">
          <edit-payment ref="updatePayment" :item="item" @refresh="refresh" />
          <v-btn color="info" icon small @click="updatePayment">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn color="error" icon small @click="deletePayment(item)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </div>
      </template>
    </app-data-table>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import { map } from 'lodash'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import EditPayment from '@/components/payment/EditPayment'

export default defineComponent({
  components: {
    EditPayment,
    AppDatePicker,
    AppDataTable
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  setup(props, { root, emit, refs }) {
    const { $api, $toast, $dialog } = useContext()
    const loading = ref(false)
    const state = reactive({
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false },
        { text: root.$t('payment.model.paymentDate'), value: 'paymentDate' },
        { text: root.$t('payment.model.paid'), value: 'paid' },
        { text: root.$t('payment.model.note'), value: 'note', sortable: false },
        { text: '', value: 'action', align: 'right', sortable: false }
      ],
      conditions: {
        limit: 10,
        page: 1,
        paymentFrom: null,
        paymentTo: null
      },
      items: [],
      totalItem: 0,
      selectedItems: []
    })

    const fetchData = async () => {
      loading.value = true
      try {
        const { data, pagination } = await $api.payment.getPayments(props.id, state.conditions)
        state.items = data
        state.totalItem = pagination.total
        loading.value = false
      } catch (e) {
        window.console.error(e)
      }
    }

    const resetFilter = () => {
      state.conditions.limit = 10
      state.conditions.page = 1
      state.conditions.paymentFrom = null
      state.conditions.paymentTo = null
    }

    watch(
      () => state.conditions,
      () => {
        fetchData()
      },
      {
        deep: true
      }
    )

    onMounted(() => {
      fetchData()
    })

    const refresh = () => {
      fetchData()
      emit('refresh')
    }

    const updatePayment = () => {
      refs.updatePayment.open()
    }

    const deletePayment = (data) => {
      $dialog
        .confirm({
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
            $api.payment.deletePayment(data.id).then(() => {
              $toast.success(root.$t('common.notice.success'))
              refresh()
            })
          }
        })
    }

    const bulkDeletePayments = () => {
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
            $api.payment.bulkDeletePayments({ ids: map(state.selectedItems, 'id') }).then(() => {
              $toast.success(root.$t('common.notice.success'))
              refresh()
              state.selectedItems = []
            })
          }
        })
    }

    return {
      loading,
      headers: toRef(state, 'headers'),
      conditions: toRef(state, 'conditions'),
      items: toRef(state, 'items'),
      totalItem: toRef(state, 'totalItem'),
      selectedItems: toRef(state, 'selectedItems'),
      fetchData,
      resetFilter,
      refresh,
      deletePayment,
      bulkDeletePayments,
      updatePayment
    }
  }
})
</script>
