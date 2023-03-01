<template>
  <app-tooltip>
    <template #activator="{ on }">
      <app-text-field class="field-copy" readonly :value="value" v-on="on" @click="copy(value)" />
    </template>
    <span>{{ tooltip }}</span>
  </app-tooltip>
</template>

<script>
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { useClipboard } from '@vueuse/core'
import AppTooltip from '@/components/common/atoms/AppTooltip'
import AppTextField from '@/components/common/atoms/AppTextField'

export default defineComponent({
  name: 'FieldCopy',
  components: {
    AppTooltip,
    AppTextField
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  setup() {
    const { copy, copied } = useClipboard()
    const tooltip = ref('Copy')

    watch(copied, (val) => {
      if (val) {
        tooltip.value = 'Copied!'
      } else {
        tooltip.value = 'Copy'
      }
    })

    return {
      copy,
      copied,
      tooltip
    }
  }
})
</script>

<style lang="scss">
.field-copy {
  .v-text-field input {
    cursor: pointer;
  }
}
</style>
