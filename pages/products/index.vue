<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('product.title.productList') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn color="primary" :to="{ name: 'products-create' }">{{ $t('product.action.create') }}</v-btn>
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
        :show-select="$acl.permission('products.edit')"
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
                <v-list-item dense @click="bulkActiveProducts">
                  <v-list-item-icon>
                    <v-icon color="primary" small>mdi-check-circle-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ $t('product.status.active') }}</v-list-item-title>
                </v-list-item>
                <v-list-item dense @click="bulkInactiveProducts">
                  <v-list-item-icon>
                    <v-icon color="error" small>mdi-close-circle-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ $t('product.status.inactive') }}</v-list-item-title>
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
        <template #item.image="{ item }">
          <div class="d-flex align-center py-1">
            <v-img contain height="52" max-width="52" :src="item.imageUrl | productImageDefault" />
          </div>
        </template>
        <template #item.name="{ item }">
          <span class="caption font-weight-bold">{{ item.name }}</span>
        </template>
        <template #item.description="{ item }">
          <span class="tw-w-28" v-html="item.description" />
        </template>
        <template #item.createdAt="{ item }">
          <span>{{ item.createdAt | formatDate }}</span>
        </template>
        <template #item.status="{ item }">
          <product-status :item="item" @refresh="execute" />
        </template>
        <template #item.action="{ item }">
          <v-btn v-if="$acl.permission('users.view')" color="accent" icon small @click="viewProduct(item)">
            <v-icon>mdi-eye-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="$acl.permission('users.edit')"
            color="info"
            icon
            small
            :to="{ name: 'products-edit-id', params: { id: item.id } }"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </template>
      </app-data-table>
    </v-card>
    <product-detail ref="viewProduct" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useRoute, ref } from '@nuxtjs/composition-api'
import { map } from 'lodash'
import { useGetProducts } from '@/composables'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import ListFilter from '@/components/products/molecules/ListFilter'
import ProductDetail from '@/components/products/molecules/ProductDetail'
import ProductStatus from '@/components/products/atoms/ProductStatus'

export default defineComponent({
  components: {
    ProductStatus,
    Breadcrumbs,
    AppDataTable,
    ListFilter,
    ProductDetail
  },
  setup(_, { root }) {
    const { $api, $toast } = useContext()
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
        status: routeQuery.status ? routeQuery.status : 1
      }),
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false, width: '1%' },
        { text: root.$t('product.model.image'), value: 'image', sortable: false, width: '5%' },
        { text: root.$t('product.model.name'), value: 'name', width: '25%' },
        { text: root.$t('product.model.size'), value: 'size' },
        { text: root.$t('product.model.unit'), value: 'unit.name', sortable: false },
        { text: root.$t('product.model.amount'), value: 'amount' },
        { text: root.$t('common.model.createdAt'), value: 'createdAt' },
        { text: root.$t('product.model.status'), value: 'status' },
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
    } = useGetProducts(state.filter)

    const onUpdateSort = () => {
      conditions.order = sortBy.value
      conditions.orderDir = sortDesc.value ? 'desc' : 'asc'
    }

    const resetFilter = () => {
      state.filter.q = null
      resetConditions(state.filter)
    }

    const bulkActiveProducts = () => {
      $api.product.bulkActiveProducts({ ids: map(state.selectedItems, 'id') }).then(() => {
        $toast.success(root.$t('common.notice.success'))
        execute()
        state.selectedItems = []
      })
    }

    const bulkInactiveProducts = () => {
      $api.product.bulkInactiveProducts({ ids: map(state.selectedItems, 'id') }).then(() => {
        $toast.success(root.$t('common.notice.success'))
        execute()
        state.selectedItems = []
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
      bulkActiveProducts,
      bulkInactiveProducts
    }
  },
  methods: {
    viewProduct(item) {
      this.$refs.viewProduct.open(item.id)
    }
  }
})
</script>
