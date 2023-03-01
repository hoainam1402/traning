<template>
  <form-dialog
    v-if="visible"
    v-model="visible"
    :loading="loading"
    :submit-text="$t('common.action.save')"
    :title="$t('payment.title')"
    width="700px"
    @submit="createPayment"
  >
    <template slot="content">
      <list-payment :id="parseInt(route.params.id)" @refresh="$emit('updated-paid')" />
      <v-divider />
      <v-row dense>
        <v-col class="text-h5 pa-1 black--text" cols="12">{{ $t('debts.action.updatePaid') }}</v-col>
        <v-divider />
        <v-col cols="12" sm="6">
          <app-currency
            v-model="form.paid"
            hide-spin-buttons
            :label="$t('debts.model.paid')"
            rules="required|min_value:1"
            type="number"
            vid="paid"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <app-date-picker
            v-model="form.paymentDate"
            :label="$t('debts.model.paymentDate')"
            rules="required"
            vid="paymentDate"
          />
        </v-col>
        <v-col cols="12">
          <app-textarea v-model="form.note" :label="$t('debts.model.note')" rows="2" rules="max:200" />
        </v-col>
      </v-row>
    </template>
  </form-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import FormDialog from '@/components/common/organisms/FormDialog'
import ListPayment from '@/components/payment/ListPayment'
import AppCurrency from '@/components/common/atoms/AppCurrency'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'
import AppTextarea from '@/components/common/atoms/AppTextarea'

export default defineComponent({
  components: {
    FormDialog,
    ListPayment,
    AppCurrency,
    AppDatePicker,
    AppTextarea
  },
  setup(_, { root, emit }) {
    const { $toast, $api } = useContext()
    const route = useRoute()
    const state = reactive({
      form: {
        customerId: route.value.params.id,
        paid: null,
        note: null,
        paymentDate: null
      }
    })
    const visible = ref(false)
    const loading = ref(false)

    const open = () => {
      visible.value = true
    }

    const createPayment = () => {
      loading.value = true
      $api.payment
        .createPayment(state.form.customerId, state.form)
        .then(() => {
          visible.value = false
          state.form.paid = null
          state.form.note = null
          state.form.paymentDate = null
          emit('updated-paid')
          $toast.success(root.$t('common.notice.success'))
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      route,
      form: toRef(state, 'form'),
      visible,
      loading,
      open,
      createPayment
    }
  }
})
</script>
