<template>
  <v-menu left offset-y transition="slide-y-transition">
    <template #activator="{ on }">
      <v-btn class="elevation-2" icon v-on="on">
        <v-badge bordered color="success" dot offset-x="10" offset-y="10">
          <v-avatar size="40">
            <v-img src="/images/avatars/default.png" />
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>

    <!-- user menu list -->
    <v-list dense nav>
      <v-list-item
        v-for="(item, index) in menu"
        :key="index"
        :disabled="item.disabled"
        :exact="item.exact"
        link
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon :class="{ 'grey--text': item.disabled }" small>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.key ? $t(item.key) : item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-1" />

      <v-list-item @click="$auth.logout()">
        <v-list-item-icon>
          <v-icon small>mdi-logout-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.logout') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      menu: [{ icon: 'mdi-account-box-outline', key: 'menu.profile', text: 'Profile', link: '/profile' }]
    }
  }
}
</script>
