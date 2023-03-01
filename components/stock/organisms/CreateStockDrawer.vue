<template>
  <right-drawer v-if="drawer" v-model="drawer" :title="$t('stock.action.create')" width="700px" @close="cancel">
    <app-form v-slot="{ handleSubmit }">
      <v-card flat>
        <v-card-text>
          <stock-form v-model="form" />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="handleSubmit(submit)">
            {{ $t('common.action.create') }}
          </v-btn>
          <v-btn outlined @click="cancel">{{ $t('common.action.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </app-form>
  </right-drawer>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import AppForm from '@/components/common/atoms/AppForm'
import RightDrawer from '@/components/common/organisms/RightDrawer'
import StockForm from '@/components/stock/molecules/StockForm'

export default defineComponent({
  name: 'CreateStockDrawer',
  components: {
    AppForm,
    RightDrawer,
    StockForm
  },
  setup(_, { root, emit }) {
    const { $api, $toast } = useContext()
    const initialState = () => ({
      form: {
        products: [],
        importedAt: null
      }
    })
    const state = reactive(initialState())
    const drawer = ref(false)
    const loading = ref(false)

    const open = () => {
      drawer.value = true
    }
    const submit = () => {
      loading.value = true
      $api.stock
        .createStock(state.form)
        .then(() => {
          emit('success')
          $toast.success(root.$t('stock.notice.createSuccess'))
          drawer.value = false
        })
        .finally(() => {
          loading.value = false
          state.form = {
            products: [],
            importedAt: null
          }
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
