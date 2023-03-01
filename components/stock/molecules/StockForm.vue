<template>
  <div>
    <stock-item v-for="(item, index) in form.products" :key="index" :item="item" @remove="onRemoveProduct(index)" />
    <v-row dense>
      <v-col cols="6">
        <products-autocomplete
          v-model="product"
          :label="$t('stock.model.productName')"
          return-object
          rules="required"
          @change="onAddProduct"
        />
      </v-col>
      <v-col cols="6">
        <app-date-picker v-model="form.importedAt" :label="$t('stock.model.importedAt')" rules="required" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { defineComponent, computed, reactive, toRef } from '@nuxtjs/composition-api'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'
import ProductsAutocomplete from '@/components/order/atoms/ProductsAutocomplete'
import StockItem from '@/components/stock/molecules/StockItem'

export default defineComponent({
  name: 'StockForm',
  components: {
    StockItem,
    AppDatePicker,
    ProductsAutocomplete
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const state = reactive({
      product: {}
    })

    const onAddProduct = () => {
      if (state.product) {
        form.value.products.push({
          product: state.product,
          productId: state.product.id,
          supplierId: null,
          amount: 1
        })
        state.product = {}
      }
    }

    const onRemoveProduct = (index) => {
      form.value.products.splice(index, 1)
    }

    return {
      form,
      product: toRef(state, 'product'),
      onAddProduct,
      onRemoveProduct
    }
  }
})
</script>
