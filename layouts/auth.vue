<template>
  <v-app>
    <div class="d-flex flex-column flex-md-row flex-grow-1 text-center">
      <v-sheet class="layout-side d-none d-md-flex flex-md-column justify-space-between mx-auto mx-md-1 px-2">
        <div class="mt-3 mt-md-10 pa-2">
          <div class="display-2 font-weight-bold primary--text">
            {{ $config.appName }}
          </div>
          <div class="title my-2">{{ $t('auth.welcome') }}</div>
        </div>
        <img alt="" class="tw-w-full" src="/images/illustrations/login-illustration.svg" />
      </v-sheet>

      <div class="d-flex flex-column flex-grow-1 justify-center align-center pa-2 pa-md-4">
        <div class="layout-content ma-auto tw-w-full">
          <nuxt />
        </div>
        <div class="overline mt-4">{{ $config.appName }}</div>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {}
</script>

<style scoped>
.layout-side {
  width: 420px;
}

.layout-content {
  max-width: 480px;
}
</style>
