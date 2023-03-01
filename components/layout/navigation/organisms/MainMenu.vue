<template>
  <v-list dense nav>
    <div v-for="(item, index) in menu" :key="index">
      <div v-if="item.key || item.text" class="overline pa-1 mt-2">{{ item.key ? $t(item.key) : item.text }}</div>
      <nav-menu :menu="item.items" />
    </div>
  </v-list>
</template>

<script>
import NavMenu from '@/components/layout/navigation/molecules/NavMenu'

export default {
  components: {
    NavMenu
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  }
}
</script>
