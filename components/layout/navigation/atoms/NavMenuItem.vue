<template>
  <div v-if="hasAccess(menuItem)">
    <v-list-item
      v-if="!menuItem.items"
      :disabled="menuItem.disabled"
      :exact="menuItem.exact"
      :input-value="menuItem.value"
      link
      :to="menuItem.link"
    >
      <v-list-item-icon>
        <v-icon :class="{ 'grey--text': menuItem.disabled }" :small="small">
          {{ menuItem.icon || 'mdi-circle-medium' }}
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-group
      v-else
      :disabled="menuItem.disabled"
      link
      :sub-group="subgroup"
      :to="menuItem.link"
      :value="menuItem.regex ? menuItem.regex.test($route.path) : false"
    >
      <template #activator>
        <v-list-item-icon v-if="!subgroup">
          <v-icon :small="small">{{ menuItem.icon || 'mdi-circle-medium' }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <slot />
    </v-list-group>
  </div>
</template>

<script>
export default {
  props: {
    menuItem: {
      type: Object,
      default: () => {}
    },
    subgroup: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasAccess(item) {
      if (item.permission) {
        return this.$acl.anyPermission(item.permission)
      }

      return true
    }
  }
}
</script>
