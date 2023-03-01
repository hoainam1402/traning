<template>
  <div>
    {{ price | currency }}
  </div>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ShowPrice',
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
    const price = computed({
      get: () => item.price,
      set: (val) => {
        item.price = val
      }
    })

    return {
      price
    }
  }
})
</script>
