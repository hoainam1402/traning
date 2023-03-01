export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Runtime config allows passing dynamic config and environment variables to the Nuxt app context.
  publicRuntimeConfig: {
    appName: process.env.APP_NAME,
    apiUrl: process.env.API_URL
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s - ${process.env.APP_NAME}`,
    title: process.env.APP_NAME,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css'
      }
    ]
  },

  // Customize the progress-bar color
  loading: '@/components/common/atoms/AppLoading',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/theme.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/api',
    '@/plugins/axios',
    '@/plugins/clipboard',
    '@/plugins/v-phone-input',
    '@/plugins/vee-validate',
    '@/plugins/vue-apexchar',
    '@/plugins/vue-currency-filter',
    '@/plugins/vue-virtual-scroll-list',
    // filters
    '@/plugins/filters/capitalize',
    '@/plugins/filters/format-date',
    '@/plugins/filters/lowercase',
    '@/plugins/filters/map-type',
    '@/plugins/filters/uppercase',
    '@/plugins/filters/product',
    '@/plugins/filters/order',
    '@/plugins/filters/transform-insurance'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Router configuration: https://nuxtjs.org/api/configuration-router
  router: {
    middleware: ['auth']
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://composition-api.nuxtjs.org
    '@nuxtjs/composition-api/module',
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://github.com/nuxt-community/moment-module
    '@nuxtjs/moment',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://vueuse.org
    '@vueuse/nuxt'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://auth.nuxtjs.org
    '@nuxtjs/auth-next',
    // https://i18n.nuxtjs.org
    '@nuxtjs/i18n',
    // https://github.com/yariksav/vuetify-dialog
    'vuetify-dialog/nuxt',
    // https://github.com/Maronato/vue-toastification
    'vue-toastification/nuxt',
    // https://github.com/phiny1/v-currency-field
    [
      'v-currency-field/nuxt-treeshaking',
      {
        locale: 'vn',
        decimalLength: 0,
        autoDecimalMode: true,
        min: null,
        max: null,
        defaultValue: 0,
        valueAsInteger: false,
        allowNegative: true
      }
    ],
    // https://portal-vue.linusb.org
    'portal-vue/nuxt'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },
  // Auth module configuration: https://auth.nuxtjs.org/guide/scheme
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: false,
      home: '/'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/admin/auth/login'
          },
          logout: {
            url: '/admin/auth/logout'
          },
          user: {
            url: '/admin/auth/user'
          }
        },
        token: {
          property: 'data.token'
        },
        user: {
          property: 'data'
        }
      }
    },
    plugins: ['@/plugins/vue-simple-acl']
  },

  // I18n module configuration: https://i18n.nuxtjs.org/options-reference
  i18n: {
    locales: [
      {
        code: 'vi',
        iso: 'vi-VN',
        file: 'vi.json'
      }
    ],
    defaultLocale: 'vi',
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locales/',
    vueI18n: {
      fallbackLocale: 'vi'
    }
  },

  // Day.js module configuration: https://github.com/nuxt-community/moment-module
  moment: {
    locales: ['vi'],
    defaultLocale: 'vi'
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['@/assets/scss/vuetify/variables/_index.scss'],
    optionsPath: '@/configs/vuetify.js',
    treeShake: true,
    defaultAssets: {
      font: false
    }
  },

  // TailwindCSS module configuration: https://tailwindcss.nuxtjs.org/options
  tailwindcss: {
    configPath: '@/configs/tailwind.js'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
