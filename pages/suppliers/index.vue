<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('supplier.title') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn v-if="$acl.permission('suppliers.create')" color="primary" @click="createSupplier">
        {{ $t('supplier.action.createSupplier') }}
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
                  <v-btn v-show="selectedItems.length" v-on="on">
                    {{ $t('common.action.choose') }}
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </transition>
              </template>
              <v-list>
                <v-list-item v-if="$acl.permission('suppliers.delete')" dense @click="bulkDeleteSuppliers">
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
          <span>{{ index + 1 }}</span>
        </template>
        <template #item.name="{ item }">
          <span class="d-inline-block">
            {{ item.name }}
          </span>
        </template>
        <template #item.email="{ item }">
          <span class="d-inline-block">
            {{ item.email }}
          </span>
        </template>
        <template #item.address="{ item }">
          <span class="d-inline-block">
            {{ item.address }}
          </span>
        </template>
        <template #item.note="{ item }">
          <span class="d-inline-block">
            {{ item.note }}
          </span>
        </template>
        <template #item.action="{ item }">
          <v-btn v-if="$acl.permission('suppliers.view')" color="accent" icon small>
            <v-icon @click="viewSupplier(item)">mdi-eye-outline</v-icon>
          </v-btn>
          <v-btn v-if="$acl.permission('suppliers.edit')" color="info" icon small @click="editSupplier(item)">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn v-if="$acl.permission('suppliers.delete')" color="error" icon small @click="deleteSupplier(item)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </template>
      </app-data-table>
    </v-card>
    <create-supplier ref="createSupplier" @success="execute" />
    <detail-supplier ref="detailSupplier" />
    <edit-supplier ref="editSupplier" @success="execute" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, ref, useContext, useRoute } from '@nuxtjs/composition-api'
import { map } from 'lodash'
import { useGetSuppliers } from '@/composables'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import ListFilter from '@/components/suppliers/molecules/ListFilter'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import CreateSupplier from '@/components/suppliers/organisms/CreateSupplierDrawer'
import DetailSupplier from '@/components/suppliers/organisms/DetailSupplierDrawer'
import EditSupplier from '@/components/suppliers/organisms/EditSupplierDrawer'

export default defineComponent({
  components: {
    Breadcrumbs,
    ListFilter,
    AppDataTable,
    CreateSupplier,
    DetailSupplier,
    EditSupplier
  },
  setup(_, { root }) {
    const { $api, $dialog, $toast } = useContext()
    const route = useRoute()
    const routeQuery = route.value.query
    const search = ref(routeQuery.q)
    const sortBy = ref(routeQuery.order || 'createdAt')
    const sortDesc = ref(routeQuery.orderDir ? routeQuery.orderDir === 'desc' : true)
    const state = reactive({
      filter: Object.assign({
        q: search,
        order: sortBy.value,
        orderDir: sortDesc.value ? 'desc' : 'asc'
      }),
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false },
        { text: root.$t('supplier.model.name'), value: 'name', width: '250px' },
        { text: root.$t('supplier.model.email'), value: 'email', width: '150px' },
        { text: root.$t('supplier.model.phone'), value: 'phone', sortable: false },
        { text: root.$t('supplier.model.address'), value: 'address', width: '300px', sortable: false },
        { text: root.$t('supplier.model.note'), value: 'note', width: '100px', sortable: false },
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
    } = useGetSuppliers(state.filter)

    const onUpdateSort = () => {
      conditions.order = sortBy.value
      conditions.orderDir = sortDesc.value ? 'desc' : 'asc'
    }

    const resetFilter = () => {
      state.filter.q = null
      resetConditions(state.filter)
    }

    const deleteSupplier = (data) => {
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
            $api.supplier.deleteSupplier(data.id).then(() => {
              $toast.success(root.$t('supplier.notice.deleteSuccess'))
              execute()
            })
          }
        })
    }

    const bulkDeleteSuppliers = () => {
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
            $api.supplier.bulkDeleteSuppliers({ ids: map(state.selectedItems, 'id') }).then(() => {
              $toast.success(root.$t('supplier.notice.deleteSuccess'))
              execute()
              state.selectedItems = []
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
      deleteSupplier,
      bulkDeleteSuppliers
    }
  },
  methods: {
    createSupplier() {
      this.$refs.createSupplier.open()
    },
    viewSupplier(item) {
      this.$refs.detailSupplier.open(item)
    },
    editSupplier(item) {
      this.$refs.editSupplier.open(item)
    }
  }
})
</script>
