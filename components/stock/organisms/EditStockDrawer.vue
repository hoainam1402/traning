<template>
  <right-drawer v-if="drawer" v-model="drawer" :title="$t('stock.action.update')" width="600px" @close="cancel">
    <app-form v-slot="{ handleSubmit }">
      <v-card flat>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6">
              <products-autocomplete v-model="form.productId" :label="$t('stock.model.productName')" rules="required" />
            </v-col>
            <v-col cols="12" sm="6">
              <suppliers-autocomplete
                v-model="form.supplierId"
                :default-params="{ productId: form.productId }"
                :label="$t('stock.model.supplierName')"
                rules="required"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <app-text-field
                v-model="form.amount"
                :label="$t('product.model.amount')"
                rules="required|min_value:1"
                type="number"
                vid="amount"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <app-date-picker
                v-model="form.importedAt"
                disabled
                :label="$t('stock.model.importedAt')"
                rules="required"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="handleSubmit(submit)">
            {{ $t('common.action.update') }}
          </v-btn>
          <v-btn outlined @click="cancel">{{ $t('common.action.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </app-form>
  </right-drawer>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import RightDrawer from '@/components/common/organisms/RightDrawer'
import AppForm from '@/components/common/atoms/AppForm'
import AppTextField from '@/components/common/atoms/AppTextField'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'
import SuppliersAutocomplete from '@/components/stock/molecules/SuppliersAutocomplete'
import ProductsAutocomplete from '@/components/order/atoms/ProductsAutocomplete'

export default defineComponent({
  components: {
    ProductsAutocomplete,
    SuppliersAutocomplete,
    AppDatePicker,
    AppTextField,
    RightDrawer,
    AppForm
  },
  setup(_, { root, emit }) {
    const initialState = () => ({
      form: {}
    })
    const { $api, $toast } = useContext()
    const drawer = ref(false)
    const loading = ref(false)
    const state = reactive(initialState())

    const open = (item) => {
      drawer.value = true
      state.form = Object.assign({}, item)
    }
    const submit = () => {
      loading.value = true
      $api.stock
        .updateStock(state.form.id, state.form)
        .then(() => {
          emit('success')
          $toast.success(root.$t('stock.notice.updateSuccess'))
          drawer.value = false
        })
        .finally(() => {
          loading.value = false
        })
    }
    const cancel = () => {
      drawer.value = false
    }

    return {
      form: toRef(state, 'form'),
      drawer,
      loading,
      open,
      submit,
      cancel
    }
  }
})
</script>
