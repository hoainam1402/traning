module.exports = {
  prefix: 'tw-',
  darkMode: 'class',
  content: [],
  theme: {
    screens: {
      // vuetify $grid-breakpoints: (
      //   'xs': 0,
      //   'sm': 600px,
      //   'md': 960px,
      //   'lg': 1280px - 16px,
      //   'xl': 1920px - 16px
      // );
      xs: '0px',
      sm: '600px',
      md: '960px',
      lg: '1264px',
      xl: '1904px'
    },
    spacing: {
      // vuetify '$spacer: 8px'
      px: '1px',
      0: 0,
      0.5: '0.25rem',
      1: '0.5rem',
      1.5: '0.75rem',
      2: '1rem',
      2.5: '1.25rem',
      3: '1.5rem',
      3.5: '1.75rem',
      4: '2rem',
      5: '2.5rem',
      6: '3rem',
      7: '3.5rem',
      8: '4rem',
      9: '4.5rem',
      10: '5rem',
      11: '5.5rem',
      12: '6rem',
      14: '7rem',
      16: '8rem',
      20: '10rem',
      24: '12rem',
      28: '14rem',
      32: '16rem',
      36: '18rem',
      40: '20rem',
      44: '22rem',
      48: '24rem',
      52: '26rem',
      56: '28rem',
      60: '30rem',
      64: '32rem',
      72: '36rem',
      80: '40rem',
      96: '48rem'
    },
    borderRadius: {
      // vuetify '$border-radius-root: 6px'
      none: 0,
      sm: '0.188rem',
      DEFAULT: '0.375rem',
      lg: '0.75rem',
      xl: '2.25rem',
      pill: '9999px',
      circle: '50%'
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
