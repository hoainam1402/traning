<template>
  <v-navigation-drawer v-model="drawer" fixed :hide-overlay="hideOverlay" right temporary :width="width">
    <div class="d-flex align-center pa-2">
      <div class="title">{{ title }}</div>
      <v-spacer />
      <v-btn icon @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <v-divider />
    <template v-if="forceRender">
      <slot v-if="drawer" />
    </template>
    <slot v-else />
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'RightDrawer',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    forceRender: {
      type: Boolean,
      default: false
    },
    hideOverlay: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 256
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
