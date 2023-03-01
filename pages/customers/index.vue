<template>
  <div class="d-flex flex-column flex-grow-1 tw-gap-3">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('customer.title') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn v-if="$acl.permission('customers.create')" color="primary" @click="createCustomer">
        {{ $t('customer.action.createCustomer') }}
      </v-btn>
    </div>
    <v-card>
      <list-filter v-model="conditions" @reset="resetFilter" />
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
        show-select
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
                  <v-btn v-show="selectedItems.length > 0" v-on="on">
                    {{ $t('common.action.choose') }}
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </transition>
              </template>
              <v-list>
                <v-list-item v-if="$acl.permission('customers.delete')" dense @click="bulkDeleteCustomer">
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
        <template #item.name="{ item }">
          <span class="d-inline-block">
            {{ item.name }}
          </span>
        </template>
        <template #item.customerType="{ item }">
          {{ item.customerType.name }}
        </template>
        <template #item.action="{ item }">
          <v-btn v-if="$acl.permission('customers.view')" color="accent" icon small @click="viewCustomer(item)">
            <v-icon>mdi-eye-outline</v-icon>
          </v-btn>
          <v-btn v-if="$acl.permission('customers.edit')" color="info" icon small @click="editCustomer(item)">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn v-if="$acl.permission('customers.delete')" color="error" icon small @click="deleteCustomer(item)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </template>
      </app-data-table>
    </v-card>
    <create-customer ref="createCustomer" @success="execute" />
    <view-customer ref="viewCustomer" />
    <edit-customer ref="editCustomer" @success="execute" />
  </div>
</template>

<script>
import { map } from 'lodash'
import { defineComponent, reactive, ref, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import { useGetCustomers } from '@/composables'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import CreateCustomer from '@/components/customer/organisms/CreateCustomerDrawer'
import EditCustomer from '@/components/customer/organisms/EditCustomerDrawer'
import ViewCustomer from '@/components/customer/organisms/DetailsCustomerDrawer'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import ListFilter from '@/components/customer/molecules/ListFilter'

export default defineComponent({
  components: {
    ListFilter,
    Breadcrumbs,
    AppDataTable,
    ViewCustomer,
    EditCustomer,
    CreateCustomer
  },
  setup(_, { root, refs }) {
    const { $api, $toast, $dialog } = useContext()
    const route = useRoute()
    const routeQuery = route.value.query
    const search = ref(routeQuery.q)
    const sortBy = ref(routeQuery.order || 'createdAt')
    const sortDesc = ref(routeQuery.orderDir ? routeQuery.orderDir === 'desc' : true)
    const state = reactive({
      filter: Object.assign({
        q: search,
        customerTypeId: routeQuery.customerTypeId ? routeQuery.customerTypeId.split(',').map((e) => parseInt(e)) : null,
        order: sortBy.value,
        orderDir: sortDesc.value ? 'desc' : 'asc',
        dateOfBirthFrom: routeQuery.dateOfBirthFrom ? $moment(routeQuery.dateOfBirthFrom).format() : '',
        dateOfBirthTo: routeQuery.dateOfBirthTo ? $moment(routeQuery.dateOfBirthTo).format() : ''
      }),
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false },
        { text: root.$t('common.model.name'), value: 'name', width: '500px' },
        { text: root.$t('customer.model.taxCode'), value: 'taxCode' },
        { text: root.$t('common.model.phone'), value: 'phone' },
        { text: root.$t('customer.model.dateOfBirth'), value: 'dateOfBirth', sortable: false },
        { text: root.$t('customer.model.type'), value: 'customerType', sortable: false },
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
    } = useGetCustomers(state.filter)

    const onUpdateSort = () => {
      conditions.order = sortBy.value
      conditions.orderDir = sortDesc.value ? 'desc' : 'asc'
    }

    const handleFilter = () => {
      conditions.q = state.filter.q
      conditions.customerTypeId = state.filter.customerTypeId
    }

    const resetFilter = () => {
      state.filter.q = null
      state.filter.customerTypeId = null
      resetConditions(state.filter)
    }

    const deleteCustomer = (data) => {
      $dialog
        .confirm({
          title: root.$t('common.message.confirmTitle'),
          text: root.$t('common.message.confirmDeletionMessage')
        })
        .then((confirm) => {
          if (confirm) {
            $api.customer.deleteCustomer(data.id).then(() => {
              execute()
              $toast.success(root.$t('customer.notice.deleteSuccess'))
            })
          }
        })
    }

    const bulkDeleteCustomer = () => {
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
            $api.customer.bulkDeleteCustomer({ ids: map(state.selectedItems, 'id') }).then(() => {
              $toast.success(root.$t('customer.notice.deleteSuccess'))
              execute()
              state.selectedItems = []
            })
          }
        })
    }

    const viewCustomer = (item) => {
      refs.viewCustomer.open(item)
    }

    const createCustomer = () => {
      refs.createCustomer.open()
    }

    const editCustomer = (item) => {
      refs.editCustomer.open(item)
    }

    return {
      search,
      sortBy,
      sortDesc,
      isFetching,
      page,
      headers: toRef(state, 'headers'),
      selectedItems: toRef(state, 'selectedItems'),
      totalItem: toRef(listState, 'totalItem'),
      items: toRef(listState, 'items'),
      filter: toRef(state, 'filter'),
      itemsPerPage,
      conditions,
      execute,
      deleteCustomer,
      bulkDeleteCustomer,
      viewCustomer,
      createCustomer,
      editCustomer,
      handleFilter,
      resetFilter,
      onUpdateSort
    }
  }
})
</script>
