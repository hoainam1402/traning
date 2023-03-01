<template>
  <v-card>
    <v-row class="align-center pa-2" dense>
      <v-col cols="6">
        <v-menu left offset-y>
          <template #activator="{ on }">
            <transition mode="out-in" name="slide-fade">
              <v-btn v-show="selectedItems.length > 0" v-on="on">
                {{ $t('common.action.choose') }}
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </transition>
          </template>
          <v-list>
            <v-list-item dense @click="bulkDeleteCustomerType">
              <v-list-item-icon>
                <v-icon color="error" small>mdi-delete-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ $t('common.action.delete') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <app-data-table
      v-model="selectedItems"
      :headers="headers"
      :items="items"
      :items-per-page.sync="conditions.limit"
      :loading="loading"
      :page.sync="conditions.page"
      show-select
    >
      <template #item.id="{ index }">
        {{ index + 1 }}
      </template>
      <template #item.name="{ item }">
        <edit-customer-type :item="item" @refresh="fetchData" />
      </template>
      <template #item.action="{ item }">
        <v-btn color="error" icon small @click="deleteCustomerType(item)">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </template>
    </app-data-table>
  </v-card>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import { map, throttle } from 'lodash'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import EditCustomerType from '@/components/customer/molecules/EditCustomerType'

export default defineComponent({
  name: 'ListCustomerType',
  components: {
    AppDataTable,
    EditCustomerType
  },
  setup(_, { root }) {
    const loading = ref(false)
    const { $api, $toast, $dialog } = useContext()
    const state = reactive({
      headers: [
        { text: root.$t('common.model.id'), value: 'id' },
        { text: root.$t('common.model.name'), value: 'name' },
        { text: '', value: 'action', align: 'right' }
      ],
      conditions: {
        limit: 10,
        page: 1
      },
      items: [],
      selectedItems: []
    })

    onMounted(() => {
      fetchData()
    })
    const fetchData = async () => {
      try {
        state.loading = true
        const { data } = await $api.customerType.getCustomerType()
        state.items = data
        state.loading = false
      } catch (e) {
        window.console.error(e)
      }
    }

    const deleteCustomerType = (item) => {
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
            $api.customerType.deleteCustomerType(item.id).then(() => {
              $toast.success(root.$t('common.notice.success'))
              fetchData()
            })
          }
        })
    }

    const bulkDeleteCustomerType = () => {
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
            $api.customerType.bulkDeleteCustomerType({ ids: map(state.selectedItems, 'id') }).then(() => {
              state.selectedItems = []
              $toast.success(root.$t('common.notice.success'))
              fetchData()
            })
          }
        })
    }

    watch(
      () => state.conditions,
      () => {
        throttle(() => fetchData(state.conditions), 150)
      },
      { deep: true }
    )

    return {
      loading,
      headers: toRef(state, 'headers'),
      conditions: toRef(state, 'conditions'),
      items: toRef(state, 'items'),
      selectedItems: toRef(state, 'selectedItems'),
      deleteCustomerType,
      fetchData,
      bulkDeleteCustomerType
    }
  }
})
</script>
