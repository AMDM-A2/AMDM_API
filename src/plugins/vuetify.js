import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import fr from 'vuetify/es5/locale/fr'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#375fa0',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c'
      },
      dark: {
        primary: '#375fa0',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c'
      }
    }
  },
  lang: {
    locales: { fr },
    current: 'fr'
  }
})
