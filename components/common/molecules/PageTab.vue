<template>
  <v-tabs
    v-model="selectedMenu"
    background-color="transparent"
    class="mb-2 mb-md-0"
    optional
    show-arrows
    :vertical="$vuetify.breakpoint.mdAndUp"
  >
    <v-tab v-for="(item, index) in items" :key="index" :to="{ name: item.route }">
      <v-icon class="mr-2" small>{{ item.icon || 'mdi-circle-medium' }}</v-icon>
      {{ item.title }}
    </v-tab>
  </v-tabs>
</template>

<script>
import { reactive, toRef } from '@nuxtjs/composition-api'

export default {
  name: 'PageTab',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const state = reactive({
      selectedMenu: []
    })

    return {
      selectedMenu: toRef(state, 'selectedMenu')
    }
  }
}
</script>

<style lang="scss">
.v-tabs--vertical {
  width: 240px !important;

  .v-tab {
    width: 240px;
  }
}
</style>
