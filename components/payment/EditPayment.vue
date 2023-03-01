<template>
  <app-form v-if="drawer" v-slot="{ handleSubmit }">
    <form-dialog
      v-model="drawer"
      :cancel-text="$t('common.action.close')"
      large
      persistent
      :submit-text="$t('common.action.save')"
      :title="$t('payment.action.updatePayment')"
      width="400"
      @submit="handleSubmit(submit)"
    >
      <template slot="content">
        <v-divider class="my-1" />
        <v-row dense>
          <v-col cols="6">
            <app-date-picker
              v-model="form.paymentDate"
              :hide-details="false"
              :label="$t('payment.model.paymentDate')"
              rules="required"
            />
          </v-col>
          <v-col cols="6">
            <app-currency
              v-model="form.paid"
              :hide-details="false"
              :label="$t('payment.model.paid')"
              rules="required|min_value:1"
            />
          </v-col>
          <v-col cols="12">
            <app-textarea
              v-model="form.note"
              :hide-details="false"
              :label="$t('payment.model.note')"
              rows="2"
              rules="max:200"
            />
          </v-col>
        </v-row>
      </template>
    </form-dialog>
  </app-form>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import AppForm from '@/components/common/atoms/AppForm'
import FormDialog from '@/components/common/organisms/FormDialog'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'
import AppCurrency from '@/components/common/atoms/AppCurrency'
import AppTextarea from '@/components/common/atoms/AppTextarea'

export default defineComponent({
  name: 'EditPayment',
  components: {
    AppForm,
    FormDialog,
    AppDatePicker,
    AppCurrency,
    AppTextarea
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const { $api, $toast } = useContext()
    const drawer = ref(false)

    const state = reactive({
      form: Object.assign({}, props.item)
    })

    const open = () => {
      drawer.value = true
    }

    const submit = async () => {
      await $api.payment
        .updatePayment(state.form)
        .then(() => {
          $toast.success(root.$t('common.notice.success'))
          drawer.value = false
        })
        .finally(() => {
          emit('refresh')
        })
    }

    return {
      form: toRef(state, 'form'),
      drawer,
      open,
      submit
    }
  }
})
</script>
