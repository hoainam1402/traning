<template>
  <right-drawer
    v-if="drawer"
    v-model="drawer"
    :title="$t('supplier.action.createSupplier')"
    width="700px"
    @close="cancel"
  >
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab href="#1">
        {{ $t('supplier.title') }}
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
              <supplier-form v-model="form" />
            </v-card-text>
            <v-divider />
          </v-card>
        </v-tab-item>
        <v-tab-item value="2">
          <v-card flat>
            <v-card-text>
              <supplier-product v-model="form" />
            </v-card-text>
            <v-divider />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      <div class="d-flex pa-2">
        <v-spacer />
        <div>
          <v-btn color="primary" :loading="loading" @click="handleSubmit(submit)">
            {{ $t('common.action.create') }}
          </v-btn>
          <v-btn outlined @click="cancel">{{ $t('common.action.cancel') }}</v-btn>
        </div>
      </div>
    </app-form>
  </right-drawer>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import RightDrawer from '@/components/common/organisms/RightDrawer'
import AppForm from '@/components/common/atoms/AppForm'
import SupplierForm from '@/components/suppliers/molecules/SupplierForm'
import SupplierProduct from '@/components/suppliers/molecules/SupplierProduct'

export default defineComponent({
  name: 'CreateSupplierDrawer',
  components: {
    RightDrawer,
    AppForm,
    SupplierForm,
    SupplierProduct
  },
  setup(_, { root, emit }) {
    const initialState = () => ({
      form: {
        name: null,
        email: null,
        phone: '',
        address: null,
        note: null,
        locationUrl: null,
        contact: {
          name: null,
          email: null,
          phone: '',
          dateOfBirth: null
        },
        productIds: []
      }
    })
    const { $api, $toast } = useContext()
    const state = reactive(initialState())
    const loading = ref(false)
    const tab = ref(null)
    const drawer = ref(false)

    const open = () => {
      drawer.value = true
    }

    watch(drawer, (val) => {
      if (!val) {
        Object.assign(state, initialState())
      }
    })

    const submit = () => {
      loading.value = true
      $api.supplier
        .createSupplier(state.form)
        .then(() => {
          emit('success')
          $toast.success(root.$t('supplier.notice.createSuccess'))
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
      loading,
      tab,
      drawer,
      open,
      submit,
      cancel
    }
  }
})
</script>
