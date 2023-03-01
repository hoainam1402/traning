<template>
  <div>
    <v-divider class="mb-1" />
    <order-item
      v-for="(item, index) in form.orderItems"
      :key="index"
      :item="item"
      :status="form.status"
      :suppliers="suppliers"
      @onRemoveProduct="onRemoveProduct(index)"
    />
    <customer-products-autocomplete
      :id="form.customerId"
      v-model="product"
      :disabled="!form.customerId"
      :label="$t('product.title.productList')"
      return-object
      rules="required"
      vid="product"
      @change="onAddProduct"
    />
    <v-divider class="mt-2" />
    <v-row v-if="form.id" class="py-2" dense>
      <v-col cols="6">
        <h4>{{ $t('order.model.totalShell') }}: {{ form.totalShell || 0 }} {{ $t('order.unit.shell') }}</h4>
      </v-col>
      <v-col cols="6">
        <h4>{{ $t('order.model.totalResidualGas') }}: {{ form.totalResidualGas || 0 }} {{ $t('order.unit.kg') }}</h4>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="6">
        <app-date-picker v-model="form.deliveryDate" :label="$t('order.model.deliveryDate')" rules="required" />
      </v-col>
      <v-col cols="6">
        <app-select
          v-model="form.status"
          :disabled="!form.id || checkStatus"
          :items="statuses"
          :label="$t('order.model.status')"
          rules="required"
        />
      </v-col>
      <v-col cols="12">
        <app-textarea v-model="form.note" :label="$t('order.model.note')" :rows="2" rules="max:200" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, toRef, watch } from '@nuxtjs/composition-api'
import OrderItem from '@/components/order/OrderItem'
import CustomerProductsAutocomplete from '@/components/order/atoms/CustomerProductsAutocomplete'
import AppSelect from '@/components/common/atoms/AppSelect'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'
import AppTextarea from '@/components/common/atoms/AppTextarea'

export default defineComponent({
  components: {
    OrderItem,
    CustomerProductsAutocomplete,
    AppSelect,
    AppDatePicker,
    AppTextarea
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    checkStatus: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root, emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('update:value', val)
      }
    })

    const array = computed(() => {
      return form.value.orderItems.map((e) => ({ productId: e.productId, supplierIds: [] }))
    })

    const suppliers = computed(() => {
      return array.value.filter((item, index) => {
        return array.value.findIndex((e) => e.productId === item.productId) === index
      })
    })

    watch(
      () => form.value.orderItems,
      () => {
        form.value.orderItems.forEach((item) => {
          const index = suppliers.value.findIndex((e) => item.productId === e.productId)
          if (index !== -1 && item.supplierId) {
            suppliers.value[index].supplierIds.push(item.supplierId)
          }
        })
      },
      { deep: true }
    )

    const state = reactive({
      product: {},
      currentDate: new Date().toJSON()
    })

    const statuses = [
      { value: root.$t('order.status.new'), key: 'new' },
      { value: root.$t('order.status.delivered'), key: 'delivered' }
    ]

    const onAddProduct = () => {
      if (state.product) {
        form.value.orderItems.push({
          product: state.product,
          productId: state.product.id,
          supplier: {},
          supplierId: null,
          amount: 1,
          shellQuantity: 0,
          residualGas: 0
        })
        state.product = {}
      }
    }

    const onRemoveProduct = (index) => {
      form.value.orderItems.splice(index, 1)
    }

    return {
      form,
      suppliers,
      product: toRef(state, 'product'),
      currentDate: toRef(state, 'currentDate'),
      statuses,
      onAddProduct,
      onRemoveProduct
    }
  }
})
</script>
