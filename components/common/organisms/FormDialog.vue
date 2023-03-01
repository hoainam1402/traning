<template>
  <v-dialog v-model="dialog" persistent scrollable :width="width">
    <form-card v-bind="$attrs" :cancel-text="$t('common.action.close')" @cancel="close" @submit="submit">
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
    </form-card>
  </v-dialog>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import FormCard from '@/components/common/molecules/FormCard'

export default defineComponent({
  name: 'FormDialog',
  components: {
    FormCard
  },
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

    const close = () => {
      emit('close')
      dialog.value = false
    }
    const submit = () => {
      emit('submit')
    }

    return {
      dialog,
      close,
      submit
    }
  }
})
</script>
