import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import fr from 'vuetify/es5/locale/fr'

Vue.use(Vuetify)

export default new Vuetify({
  theme: { dark: false },
  lang: {
    locales: { fr },
    current: 'fr'
  }
})
