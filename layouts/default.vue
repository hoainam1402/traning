<template>
  <v-app class="d-flex flex-grow-1">
    <!-- Navigation -->
    <v-navigation-drawer v-model="drawer" app class="elevation-1" color="primary" dark floating>
      <!-- Navigation menu info -->
      <template #prepend>
        <div class="pa-2">
          <div class="title font-weight-bold text-uppercase white--text">{{ $config.appName }}</div>
          <div class="overline grey--text">v1.0</div>
        </div>
      </template>

      <!-- Navigation menu -->
      <main-menu :menu="navigation.menu" />
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar app light>
      <v-card class="d-flex flex-grow-1 pa-0 ma-0" flat>
        <div class="d-flex flex-grow-1 align-center">
          <div class="d-flex flex-grow-1 align-center">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

            <v-spacer class="d-none d-lg-block" />

            <v-spacer class="d-block d-sm-none" />

            <toolbar-user />
          </div>
        </div>
      </v-card>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" :fluid="$vuetify.breakpoint.lgOnly">
        <v-layout>
          <nuxt />
        </v-layout>
      </v-container>

      <v-footer app inset>
        <v-spacer />
        <div class="overline">
          {{ $t('footer.poweredBy') }}
          <v-icon color="primary" small>mdi-copyright</v-icon>
          <strong class="primary--text">{{ $config.appName }}</strong>
        </div>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import config from '@/configs'
import MainMenu from '@/components/layout/navigation/organisms/MainMenu'
import ToolbarUser from '@/components/layout/toolbar/atoms/ToolbarUser'

export default {
  components: {
    MainMenu,
    ToolbarUser
  },
  data() {
    return {
      drawer: null,
      navigation: config.navigation
    }
  }
}
</script>
