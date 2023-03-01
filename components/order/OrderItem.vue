<template>
  <v-row class="align-center mb-1" dense>
    <v-col class="pr-0" cols="3">
      <h3>{{ orderItem.product.name }} ( {{ orderItem.product.size }} )</h3>
    </v-col>
    <v-col class="pr-0" cols="3">
      <suppliers-autocomplete
        v-if="!orderItem.orderId"
        :id="orderItem.productId"
        v-model="orderItem.supplier"
        :default-params="{ ids: supplier.supplierIds }"
        :label="$t('supplier.title')"
        return-object
        vid="supplier"
      />
      <app-text-field
        v-else
        disabled
        :label="$t('supplier.title')"
        :value="`${orderItem.supplier.name} (${orderItem.supplier.totalAmount})`"
      />
    </v-col>
    <v-col class="pr-0" cols="2">
      <order-text-field
        v-model="orderItem.amount"
        hide-spin-buttons
        :label="$t('orderItem.model.amount')"
        :rules="`required|numeric|min_value:0|max_value:${maxValue}`"
        type="number"
      />
    </v-col>
    <v-col v-if="status !== 'new' && orderItem.product.type === 1" class="pr-0" cols="1">
      <order-text-field
        v-model="orderItem.shellQuantity"
        hide-spin-buttons
        :label="$t('orderItem.model.shell')"
        :rules="`numeric|min_value:0`"
        type="number"
      />
    </v-col>
    <v-col v-if="status !== 'new' && orderItem.product.type === 1" class="pr-0" cols="1">
      <order-text-field
        v-model="orderItem.residualGas"
        hide-spin-buttons
        :label="$t('orderItem.model.residualGas')"
        rules="min_value:0|max_value:10000"
        :suffix="$t('order.unit.kg')"
        type="number"
      />
    </v-col>
    <v-col class="pr-0 d-flex" cols="1">
      <order-text-field
        disabled
        hide-spin-buttons
        :label="$t('orderItem.model.remain')"
        type="number"
        :value="remain > 0 ? remain : '0'"
      />
    </v-col>
    <v-col class="pr-0 d-flex" cols="1">
      <v-btn color="error" icon small @click="$emit('onRemoveProduct', orderItem.product.id)">
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api'
import SuppliersAutocomplete from '@/components/order/atoms/SuppliersAutocomplete'
import AppTextField from '@/components/common/atoms/AppTextField'
import OrderTextField from '@/components/order/atoms/OrderTextField'

export default defineComponent({
  name: 'OrderItem',
  components: {
    SuppliersAutocomplete,
    AppTextField,
    OrderTextField
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    status: {
      type: String,
      default: null
    },
    suppliers: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const orderItem = computed({
      get: () => props.item,
      set: (val) => {
        emit('update:value', val)
      }
    })

    const supplier = computed(() => {
      return props.suppliers.find((item) => item.productId === orderItem.value.productId)
    })

    watch(
      () => orderItem.value.supplier,
      () => {
        if (orderItem.value.supplier) {
          orderItem.value.supplierId = orderItem.value.supplier.id
        }
      },
      { deep: true }
    )

    const firstValue = ref(orderItem.value.orderId ? orderItem.value.amount : 0)

    const sub = computed(() => {
      return parseInt(orderItem.value.amount) - parseInt(firstValue.value)
    })

    const maxValue = computed(() => {
      if (orderItem.value.supplier) {
        return parseInt(orderItem.value.supplier.totalAmount) + firstValue.value
      } else {
        return 10000
      }
    })

    const remain = computed(() => {
      if (orderItem.value.supplier) {
        return parseInt(orderItem.value.supplier.totalAmount) - sub.value
      } else {
        return 0
      }
    })

    return {
      orderItem,
      supplier,
      maxValue,
      remain
    }
  }
})
</script>
