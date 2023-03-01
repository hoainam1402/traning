<template>
  <app-form v-slot="{ handleSubmit }" class="tw-w-full">
    <div class="d-flex flex-column flex-grow-1">
      <div class="d-flex align-center">
        <div>
          <div class="display-1">{{ $t('order.action.createOrder') }}</div>
          <breadcrumbs />
        </div>
      </div>
      <v-row dense>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ $t('order.model.customerInformation') }}</span>
              <template v-if="form.customerId">
                <v-spacer />
                <v-btn icon small @click="clearCustomer">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <template v-if="form.customerId">
                <div class="pa-1">
                  <v-icon>mdi-account-reactivate-outline</v-icon>
                  <label class="pl-2">{{ form.customer.name }}</label>
                </div>
                <div class="pa-1">
                  <v-icon>mdi-phone-outline</v-icon>
                  <label class="pl-2">{{ form.customer.phone }}</label>
                </div>
                <div class="pa-1 d-flex">
                  <div>
                    <v-icon>mdi-map-marker-outline</v-icon>
                  </div>
                  <address-autocomplete
                    v-if="select"
                    :id="form.customerId"
                    v-model="form.deliveryAddress"
                    class="pl-2 tw-w-full"
                    :label="$t('order.model.deliveryAddress')"
                    rules="required"
                  />
                  <app-text-field
                    v-else
                    v-model="form.deliveryAddress"
                    class="pl-2 tw-w-full"
                    :label="$t('order.model.deliveryAddress')"
                    rules="required|max:100"
                  />
                  <v-btn icon small @click="changeAddress">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-else>
                <customers-autocomplete
                  v-model="form.customer"
                  :label="$t('customer.title')"
                  return-object
                  rules="required"
                />
              </template>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ $t('order.model.orderInformation') }}</span>
            </v-card-title>
            <v-card-text class="pt-2">
              <order-form v-model="form" />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn class="px-2 mr-1" :disabled="loading" text @click="$router.push({ name: 'orders' })">
                {{ $t('common.action.cancel') }}
              </v-btn>
              <v-btn class="px-2" color="primary" :loading="loading" @click="handleSubmit(submit)">
                <span>{{ $t('common.action.create') }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </app-form>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useRouter, watch } from '@nuxtjs/composition-api'
import AppForm from '@/components/common/atoms/AppForm'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import OrderForm from '@/components/order/OrderForm'
import AddressAutocomplete from '@/components/order/atoms/AddressAutocomplete'
import AppTextField from '@/components/common/atoms/AppTextField'
import CustomersAutocomplete from '@/components/order/atoms/CustomersAutocomplete'

export default defineComponent({
  components: {
    AppForm,
    Breadcrumbs,
    OrderForm,
    AddressAutocomplete,
    AppTextField,
    CustomersAutocomplete
  },
  setup(_, { root }) {
    const { $api, $toast } = useContext()
    const router = useRouter()
    const state = reactive({
      select: true,
      form: {
        customerId: null,
        customer: {},
        orderItems: [],
        deliveryDate: null,
        deliveryAddress: null,
        status: 'new',
        note: null,
        totalQuantity: 0,
        totalShell: 0,
        totalResidualGas: 0
      },
      loading: false
    })

    watch(
      () => state.form.orderItems,
      () => {
        state.form.totalQuantity = state.form.orderItems.reduce((acc, cur) => parseInt(acc) + parseInt(cur.amount), 0)
        state.form.totalShell = state.form.orderItems.reduce(
          (acc, cur) => parseInt(acc) + parseInt(cur.shellQuantity),
          0
        )
        state.form.totalResidualGas = state.form.orderItems.reduce(
          (acc, cur) => parseFloat(acc) + parseFloat(cur.residualGas),
          0
        )
      },
      { deep: true }
    )

    watch(
      () => state.form.customer,
      () => {
        if (state.form.customer) {
          state.form.customerId = state.form.customer.id
        }
      },
      { deep: true }
    )

    const clearCustomer = () => {
      state.form.customerId = null
      state.form.orderItems = []
      state.form.customer = {}
      state.form.deliveryAddress = null
    }

    const changeAddress = () => {
      state.select = !state.select
      state.form.deliveryAddress = null
    }

    const submit = () => {
      if (!state.form.customerId) {
        return $toast.error(root.$t('order.message.customerRequired'))
      } else if (state.form.orderItems.length === 0) {
        return $toast.error(root.$t('order.message.orderItemsRequired'))
      } else if (!state.form.deliveryAddress) {
        return $toast.error(root.$t('order.message.addressRequired'))
      }
      const checked = state.form.orderItems.some((element) => !element.supplier.name)
      if (checked) {
        return $toast.error(root.$t('order.message.supplierRequired'))
      }

      if (state.loading) return
      state.loading = true
      $api.order
        .createOrder(state.form)
        .then(() => {
          $toast.success(root.$t('common.notice.success'))
          router.push('/orders')
        })
        .finally(() => {
          state.loading = false
        })
    }

    return {
      select: toRef(state, 'select'),
      form: toRef(state, 'form'),
      loading: toRef(state, 'loading'),
      clearCustomer,
      changeAddress,
      submit
    }
  }
})
</script>
