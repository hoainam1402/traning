<template>
  <right-drawer
    v-if="drawer"
    v-model="drawer"
    :title="$t('customer.action.editCustomer')"
    width="700px"
    @close="cancel"
  >
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab href="#1">
        {{ $t('customer.title') }}
      </v-tab>
      <v-tab href="#2">
        {{ $t('product.title.productList') }}
      </v-tab>
    </v-tabs>
    <app-form v-slot="{ handleSubmit }">
      <v-tabs-items v-model="tab">
        <v-tab-item value="1">
          <v-card flat>
            <v-card-text>
              <customer-form v-model="form" />
            </v-card-text>
            <v-divider />
          </v-card>
        </v-tab-item>
        <v-tab-item value="2">
          <v-card flat>
            <v-card-text>
              <customer-product v-model="form" />
            </v-card-text>
            <v-divider />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      <div class="d-flex pa-2">
        <v-spacer />
        <div>
          <v-btn color="primary" :loading="loading" @click="handleSubmit(submit)">
            {{ $t('common.action.save') }}
          </v-btn>
          <v-btn outlined @click="cancel">{{ $t('common.action.cancel') }}</v-btn>
        </div>
      </div>
    </app-form>
  </right-drawer>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import RightDrawer from '@/components/common/organisms/RightDrawer'
import AppForm from '@/components/common/atoms/AppForm'
import CustomerForm from '@/components/customer/molecules/CustomerForm'
import CustomerProduct from '@/components/customer/molecules/CustomerProduct'

export default defineComponent({
  name: 'EditCustomerDrawer',
  components: {
    AppForm,
    RightDrawer,
    CustomerForm,
    CustomerProduct
  },
  setup(_, { root, emit }) {
    const initialState = () => ({
      form: {}
    })
    const { $api, $toast } = useContext()
    const state = reactive(initialState())
    const loading = ref(false)
    const tab = ref(null)
    const drawer = ref(false)

    const open = (item) => {
      drawer.value = true
      state.form = Object.assign({}, item)
    }
    const submit = () => {
      loading.value = true
      $api.customer
        .updateCustomer(state.form.id, state.form)
        .then(() => {
          emit('success')
          $toast.success(root.$t('customer.notice.updateSuccess'))
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
      tab,
      open,
      submit,
      cancel
    }
  }
})
</script>
