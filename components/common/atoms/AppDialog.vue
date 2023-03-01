<template>
  <v-dialog v-model="dialog" persistent scrollable :width="width">
    <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
  </v-dialog>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'AppDialog',
  props: {
    value: Boolean,
    width: {
      type: [String, Number],
      default: 'auto'
    }
  },
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        return emit('input', val)
      }
    })

    return {
      dialog
    }
  }
})
</script>
