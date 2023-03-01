<template>
  <v-row class="align-center mb-1" dense>
    <v-col class="pr-0" cols="4">
      <h3>{{ form.product.name }} ({{ form.product.size }})</h3>
    </v-col>
    <v-col class="pr-0" cols="5">
      <suppliers-autocomplete v-model="form.supplierId" :label="$t('supplier.title')" rules="required" />
    </v-col>
    <v-col class="pr-0" cols="2">
      <app-text-field
        v-model="form.amount"
        :label="$t('product.model.amount')"
        rules="required|numeric|min_value:1"
        type="number"
      />
    </v-col>
    <v-col class="pr-0 d-flex" cols="1">
      <v-btn color="error" icon small @click="$emit('remove', form.productId)">
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import AppTextField from '@/components/common/atoms/AppTextField'
import SuppliersAutocomplete from '@/components/stock/molecules/SuppliersAutocomplete'

export default defineComponent({
  name: 'StockItem',
  components: {
    SuppliersAutocomplete,
    AppTextField
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.item,
      set: (val) => {
        emit('update:value', val)
      }
    })

    return {
      form
    }
  }
})
</script>
