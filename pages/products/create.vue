<template>
  <div class="tw-w-full">
    <app-form v-slot="{ handleSubmit }">
      <v-card>
        <div class="d-flex justify-space-between align-center pa-2">
          <h3>{{ $t('product.title.createProduct') }}</h3>
          <div>
            <v-btn class="mr-1" color="primary" @click="handleSubmit(createProduct)">
              {{ $t('common.action.save') }}
            </v-btn>
            <v-btn outlined :to="{ name: 'products' }">
              <v-icon left small>mdi-arrow-left</v-icon>
              {{ $t('common.action.back') }}
            </v-btn>
          </div>
        </div>
      </v-card>
      <product-form v-model="form" />
    </app-form>
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useRouter } from '@nuxtjs/composition-api'
import { serialize } from 'object-to-formdata'
import AppForm from '@/components/common/atoms/AppForm'
import ProductForm from '@/components/products/molecules/ProductForm'

export default defineComponent({
  components: {
    AppForm,
    ProductForm
  },

  setup(_, { root }) {
    const router = useRouter()
    const { $toast, $api } = useContext()

    const state = reactive({
      form: {
        id: null,
        image: null,
        name: null,
        type: 0,
        unit: {
          id: null
        },
        description: null,
        amount: null,
        size: null
      }
    })

    const createProduct = async () => {
      state.form.unitId = state.form.unit.id
      await $api.product.createProduct(serialize(state.form)).then(() => {
        $toast.success(root.$t('common.notice.success'))
        router.push({ name: 'products' })
      })
    }

    return {
      form: toRef(state, 'form'),
      createProduct
    }
  }
})
</script>
