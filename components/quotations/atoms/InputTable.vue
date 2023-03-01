<template>
  <app-currency v-model="price" hide-spin-buttons :outlined="false" type="number">
    <app-tooltip v-if="changed" slot="append" bottom>
      <template #activator="{ on, attrs }">
        <v-icon class="cursor-pointer" color="warning" v-bind="attrs" v-on="on">mdi-draw-pen</v-icon>
      </template>
      <span>Bạn đã thay đổi giá trị từ {{ priceTemp }} thành {{ price }}</span>
    </app-tooltip>
  </app-currency>
</template>

<script>
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api'
import AppCurrency from '@/components/common/atoms/AppCurrency'
import AppTooltip from '@/components/common/atoms/AppTooltip'

export default defineComponent({
  name: 'InputTable',
  components: {
    AppCurrency,
    AppTooltip
  },
  props: {
    products: {
      type: Array,
      required: true
    },
    productId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const item = props.products.find((e) => e.productId === props.productId)
    const priceTemp = ref(item.price)
    const price = computed({
      get: () => item.price,
      set: (val) => {
        item.price = val
      }
    })
    const changed = ref(false)

    watch(price, (val) => {
      changed.value = parseInt(priceTemp.value) !== parseInt(val)
    })

    return {
      priceTemp,
      price,
      changed
    }
  }
})
</script>
