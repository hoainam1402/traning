<template>
  <app-tooltip>
    <template #activator="{ on }">
      <div ref="label-copy" class="label-copy animate__faster" v-on="on" @click.stop.prevent="copy">{{ text }}</div>
    </template>
    <span>{{ tooltip }}</span>
  </app-tooltip>
</template>

<script>
import AppTooltip from '@/components/common/atoms/AppTooltip'

export default {
  name: 'LabelCopy',
  components: {
    AppTooltip
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    toastText: {
      type: String,
      default: 'Copied to clipboard!'
    }
  },
  data() {
    return {
      tooltip: 'Copy',
      timeout: null
    }
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout)
  },
  methods: {
    copy() {
      this.$clipboard(this.text, this.toastText)
      this.tooltip = 'Copied!'

      this.timeout = setTimeout(() => {
        this.tooltip = 'Copy'
      }, 2000)
    }
  }
}
</script>

<style scoped>
.label-copy {
  display: inline-block;
  border-bottom: 1px dashed;
  cursor: pointer;
}
</style>
