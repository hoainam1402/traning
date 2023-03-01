<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('quotation.title') }} {{ stateDate | formatDate('DD-MM-YYYY') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
    </div>
    <v-card>
      <quotation-filter ref="quotationFilter" v-model="conditions" @changeMonth="getDate" @reset="resetFilter" />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab class="uppercase" @click="conditions.type = 1">{{ $t('quotation.tab.tabItem.customer') }}</v-tab>
        <v-tab v-if="$acl.permission('quotations.supplier.view')" class="uppercase" @click="conditions.type = 2">
          {{ $t('quotation.tab.tabItem.supplier') }}
        </v-tab>
      </v-tabs>
      <v-card>
        <v-row class="align-center pa-2" dense>
          <v-col cols="6">
            <div class="d-flex">
              <v-btn class="mr-2" color="primary" :disabled="edited" @click="openCreateQuotation">
                {{ $t('quotation.action.createPriceQuotation') }}
              </v-btn>
              <v-btn
                v-if="items.length > 0 && edited && !update"
                class="mr-2"
                color="success"
                :disabled="!edited"
                @click="createQuotation"
              >
                {{ $t('common.action.save') }}
              </v-btn>
              <v-btn v-if="items.length === 0 && dates.length === 0" class="mr-2" color="warning" @click="onCancel">
                <v-icon left>mdi-keyboard-backspace</v-icon>
                {{ $t('common.action.back') }}
              </v-btn>
              <v-btn v-if="items.length > 0 && !edited" class="mr-2" color="info" @click="onUpdate">
                {{ $t('common.action.update') }}
              </v-btn>
              <v-btn
                v-if="items.length > 0 && edited && update"
                class="mr-2"
                color="success"
                :disabled="!edited"
                @click="updateQuotation"
              >
                {{ $t('common.action.save') }}
              </v-btn>
              <v-btn v-if="items.length > 0" color="warning" :disabled="!edited" @click="onCancel">
                {{ $t('common.action.cancel') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <p class="subtitle-2 pl-2 italic mb-0 tw-text-yellow-500">*Giá dưới đây đã bao gồm VAT</p>
        <v-progress-linear :active="isFetching" color="primary" indeterminate />
        <customer-quotation-table
          v-if="!loading && conditions.type === 1"
          v-model="conditions.stateDate"
          :create="create"
          :dates="dates"
          :edited="edited"
          :products="products"
          :quotations="items"
        />
        <supplier-quotation-table
          v-if="!loading && conditions.type === 2"
          v-model="conditions.stateDate"
          :create="create"
          :dates="dates"
          :edited="edited"
          :products="products"
          :quotations="items"
        />
      </v-card>
      <month-apply-dialog ref="monthApply" v-model="formDate" @click="beforeCreateQuotation" />
    </v-card>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useFetch, useRoute, watch } from '@nuxtjs/composition-api'
import { useGetQuotations } from '@/composables'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import QuotationFilter from '@/components/quotations/organisms/QuotationFilter'
import CustomerQuotationTable from '@/components/quotations/molecules/CustomerQuotationTable'
import SupplierQuotationTable from '@/components/quotations/molecules/SupplierQuotationTable'
import MonthApplyDialog from '@/components/quotations/organisms/MonthApplyDialog'

export default defineComponent({
  components: {
    Breadcrumbs,
    QuotationFilter,
    CustomerQuotationTable,
    SupplierQuotationTable,
    MonthApplyDialog
  },
  setup(_, { root, refs }) {
    const { $api, $moment, $toast } = useContext()
    const route = useRoute()
    const routeQuery = route.value.query
    const loading = ref(false)
    const edited = ref(false)
    const update = ref(false)
    const create = ref(false)
    const monthYear = ref($moment().format('YYYY-MM'))
    const stateDate = ref(routeQuery.stateDate || $moment().format('YYYY-MM-DD'))
    const search = ref(routeQuery.q)
    const type = ref(parseInt(routeQuery.type) || 1)
    const tab = ref(type.value === 1 ? 0 : 1)
    const state = reactive({
      filter: Object.assign({
        q: search,
        type: type.value,
        stateDate: stateDate.value
      }),
      products: [],
      dates: [],
      formDate: {
        applyDate: $moment().format('YYYY-MM-DD'),
        amplitude: 0
      }
    })

    const { state: listState, conditions, isFetching, execute, page, itemsPerPage } = useGetQuotations(state.filter)

    watch(
      () => conditions,
      (val) => {
        type.value = val.type
        stateDate.value = val.stateDate
        edited.value = false
        listState.items = []
      },
      {
        deep: true
      }
    )

    watch(
      () => conditions.type,
      () => {
        refs.quotationFilter.resetMonthYear()
      }
    )

    const getDate = (val) => {
      edited.value = false
      loading.value = true
      $api.quotation
        .getDates({
          type: conditions.type,
          monthYear: val
        })
        .then(({ data }) => {
          state.dates = data
          if (state.dates.length === 0) {
            listState.items = []
            stateDate.value = $moment().format('YYYY-MM-DD')
          } else {
            stateDate.value = state.dates[0].applyDate
            conditions.stateDate = state.dates[0].applyDate
            execute()
          }
        })
      loading.value = false
    }

    const getProducts = () => {
      return $api.product
        .getProducts({ status: 1 })
        .then(({ data }) => {
          state.products = data
        })
        .finally(() => {
          loading.value = false
        })
    }

    useFetch(async () => {
      loading.value = true
      await getProducts()
      getDate(monthYear.value)
    })

    const beforeCreateQuotation = () => {
      loading.value = true
      try {
        $api.quotation
          .getNewQuotations({
            type: type.value,
            applyDate: state.formDate.applyDate
          })
          .then(({ data }) => {
            listState.items = data.map((i) => {
              return {
                id: 0,
                quotable: {
                  id: i.id,
                  name: i.name
                },
                products: i.quotationProducts.map((e) => ({
                  productId: e.productId,
                  price: e.price + Number(state.formDate.amplitude)
                })),
                note: null
              }
            })
            stateDate.value = state.formDate.applyDate
            create.value = true
            edited.value = true
          })
      } catch (e) {
        this.$toast.error('Error')
      }
      loading.value = false
    }

    const onUpdate = async () => {
      loading.value = true
      await getProducts()
      $api.quotation
        .getUpdateQuotations({
          type: type.value,
          applyDate: stateDate.value
        })
        .then(({ data }) => {
          listState.items = data.map((i) => {
            return {
              id: i.quotationId,
              quotable: {
                id: i.id,
                name: i.name
              },
              products: i.quotationProducts.map((e) => ({
                id: e.id,
                productId: e.productId,
                price: e.price
              })),
              note: null
            }
          })
          edited.value = true
          update.value = true
          loading.value = false
        })
    }

    const createQuotation = () => {
      $api.quotation
        .createQuotations({
          type: type.value,
          applyDate: state.formDate.applyDate,
          data: listState.items.map((i) => {
            return {
              id: i.id,
              quotableId: i.quotable.id,
              products: i.products,
              note: null
            }
          })
        })
        .then(() => {
          edited.value = false
          create.value = false
          listState.items = []
          $toast.success(root.$t('common.notice.success'))
          getDate(monthYear.value)
        })
    }
    const updateQuotation = () => {
      $api.quotation
        .updateQuotations({
          type: type.value,
          applyDate: stateDate.value,
          data: listState.items.map((i) => {
            return {
              id: i.id,
              quotableId: i.quotable.id,
              products: i.products,
              note: null
            }
          })
        })
        .then(() => {
          edited.value = false
          update.value = false
          $toast.success(root.$t('common.notice.success'))
          getDate(monthYear.value)
        })
    }

    const resetFilter = () => {
      conditions.type = 1
      monthYear.value = $moment().format('YYYY-MM')
      getDate($moment().format('YYYY-MM'))
      conditions.q = null
    }
    const onCancel = () => {
      monthYear.value = $moment().format('YYYY-MM')
      getDate($moment().format('YYYY-MM'))
      edited.value = false
      create.value = false
    }

    return {
      loading,
      edited,
      update,
      create,
      search,
      type,
      monthYear,
      stateDate,
      tab,
      filter: toRef(state, 'filter'),
      items: toRef(listState, 'items'),
      products: toRef(state, 'products'),
      formDate: toRef(state, 'formDate'),
      dates: toRef(state, 'dates'),
      conditions,
      isFetching,
      execute,
      page,
      itemsPerPage,
      beforeCreateQuotation,
      createQuotation,
      updateQuotation,
      resetFilter,
      onCancel,
      onUpdate,
      getDate
    }
  },
  methods: {
    openCreateQuotation() {
      this.$refs.monthApply.open()
    }
  }
})
</script>
