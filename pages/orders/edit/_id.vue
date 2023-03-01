<template>
  <app-form v-slot="{ handleSubmit }" class="tw-w-full">
    <div class="d-flex flex-column flex-grow-1">
      <div class="d-flex align-center">
        <div>
          <div class="display-1">{{ $t('order.action.updateOrder') }}</div>
          <breadcrumbs />
        </div>
      </div>
      <v-row dense>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ $t('order.model.customerInformation') }}</span>
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
                    v-if="select || !form.id"
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
                    rules="required|max:255"
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
              <order-form v-model="form" :check-status="checkStatus" />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn class="px-2 mr-1" :disabled="loading" text @click="$router.push({ name: 'orders' })">
                {{ $t('common.action.cancel') }}
              </v-btn>
              <v-btn class="px-2" color="primary" :loading="loading" @click="handleSubmit(submit)">
                <span>{{ $t('common.action.update') }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </app-form>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useFetch, useRouter, watch } from '@nuxtjs/composition-api'
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
    const router = useRouter()
    const { $api, $toast, params, $moment } = useContext()
    const state = reactive({
      select: false,
      form: {},
      loading: false,
      checkStatus: false
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

    useFetch(async () => {
      const { data } = await $api.order.getOrder(params.value.id)
      state.form = data
      const checkDateFeture = $moment(data.deliveryDate).diff($moment(new Date()).format('YYYY-MM-DD'), 'days')
      if (data.status === 'delivered' || checkDateFeture > 1) {
        state.checkStatus = true
      }
    })

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
        .updateOrder(state.form.id, state.form)
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
      checkStatus: toRef(state, 'checkStatus'),
      changeAddress,
      submit
    }
  }
})
</script>
