<template>
  <app-right-drawer v-model="drawer" :title="product.name" width="35%" @close="cancel">
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <div class="tw-relative">
              <p class="tw-text-base font-weight-bold mb-1">{{ $t('product.model.image') }}:</p>
              <v-img contain height="230" :src="product.imageUrl | productImageDefault" />
            </div>
          </v-col>
          <v-col cols="6">
            <p class="tw-text-base font-weight-bold mb-1">{{ $t('product.model.name') }}:</p>
            <span class="black--text font-weight-regular">{{ product.name }}</span>
          </v-col>
          <v-col cols="6">
            <p class="tw-text-base font-weight-bold mb-1">{{ $t('product.model.size') }}:</p>
            <span class="black--text font-weight-regular">{{ product.size }}</span>
          </v-col>
          <v-col cols="6">
            <p class="tw-text-base font-weight-bold mb-1">{{ $t('product.model.unit') }}:</p>
            <span class="black--text font-weight-regular">{{ unit.name }}</span>
          </v-col>
          <v-col cols="6">
            <p class="tw-text-base font-weight-bold mb-1">{{ $t('product.model.amount') }}:</p>
            <span class="black--text font-weight-regular">{{ product.amount }}</span>
          </v-col>
          <v-col cols="12">
            <p class="tw-text-base font-weight-bold mb-1">{{ $t('product.model.description') }}:</p>
            <span class="black--text font-weight-regular tw-break-all" v-html="product.description" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn outlined @click="cancel">{{ $t('common.action.back') }}</v-btn>
      </v-card-actions>
    </v-card>
  </app-right-drawer>
</template>

<script>
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import AppRightDrawer from '@/components/common/atoms/AppRightDrawer'

export default defineComponent({
  name: 'ProductDetail',
  components: {
    AppRightDrawer
  },
  setup() {
    const { $api } = useContext()

    const product = ref([])
    const unit = ref([])
    const drawer = ref(false)
    const open = (id) => {
      drawer.value = true
      $api.product.getProduct(id).then(({ data }) => {
        product.value = data
        unit.value = data.unit
      })
    }
    const cancel = () => {
      drawer.value = false
    }

    return {
      product,
      unit,
      drawer,
      open,
      cancel
    }
  }
})
</script>
