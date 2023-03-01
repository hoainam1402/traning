<template>
  <v-navigation-drawer v-model="drawer" absolute class="filter-drawer" :right="right">
    <v-divider />
    <div class="d-flex align-center px-2 py-1">
      <div class="title">{{ $t('common.action.filter') }}</div>
      <v-spacer />
      <v-btn icon @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <v-divider />
    <slot />
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'FilterDrawer',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    drawer: {
      get() {
        return this.value
      },
      set(val) {
        return this.$emit('input', val)
      }
    }
  },
  methods: {
    close() {
      this.drawer = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.filter-drawer.v-navigation-drawer--absolute {
  @apply tw-z-10;

  .v-navigation-drawer__content {
    @apply tw-pt-0;
  }
}
</style>
