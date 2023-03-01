import vi from '@/locales/vi.json'
import theme from '@/configs/theme'

export default {
  lang: {
    locales: {
      vi: vi.vuetify
    },
    current: 'vi'
  },
  theme: {
    dark: theme.globalTheme === 'dark',
    options: {
      customProperties: true
    },
    themes: {
      dark: theme.dark,
      light: theme.light
    }
  }
}
