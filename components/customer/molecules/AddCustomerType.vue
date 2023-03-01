<template>
  <app-form v-if="drawer" v-slot="{ handleSubmit }">
    <form-dialog
      v-model="drawer"
      :cancel-text="$t('common.action.cancel')"
      :loading="loading"
      :submit-text="$t('common.action.create')"
      :title="$t('customerType.title')"
      width="600px"
      @close="cancel"
      @submit="handleSubmit(submit)"
    >
      <template slot="content">
        <list-customer-type />
        <customer-type-form v-model="form" />
      </template>
    </form-dialog>
  </app-form>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import ListCustomerType from '@/components/customer/molecules/ListCustomerType'
import CustomerTypeForm from '@/components/customer/molecules/CustomerTypeForm'
import AppForm from '@/components/common/atoms/AppForm'
import FormDialog from '@/components/common/organisms/FormDialog'

export default defineComponent({
  components: {
    FormDialog,
    AppForm,
    ListCustomerType,
    CustomerTypeForm
  },
  setup(_, { root, emit }) {
    const drawer = ref(false)
    const loading = ref(false)
    const { $api, $toast } = useContext()
    const initialState = () => ({
      form: {
        name: null
      }
    })

    const state = reactive(initialState())

    const open = () => {
      drawer.value = true
    }

    const submit = async () => {
      if (state.loading) return
      state.loading = true
      await $api.customerType.createCustomerType(state.form).then(() => {
        $toast.success(root.$t('common.notice.success'))
      })
      state.loading = false
      state.form.name = null
      drawer.value = false
    }

    const cancel = () => {
      drawer.value = false
    }

    const close = () => {
      emit('closeRefresh')
    }

    return {
      drawer,
      loading,
      form: toRef(state, 'form'),
      open,
      submit,
      cancel,
      close
    }
  }
})
</script>
