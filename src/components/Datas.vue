<template>
  <v-container>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      width="290"
    >
      <div :style="!$vuetify.breakpoint.mobile ? `margin-top: ${$vuetify.application.top}px` : null"
           class="d-flex justify-center align-content-center flex-column">
        <v-date-picker v-model="dates" color="#8e0088" locale="fr" range
                       selected-items-text="Sélection"></v-date-picker>
        <v-btn class="ml-4 mr-4" color="#8e0088" outlined @click="dates = []; fetchData()">
          <v-icon class="mr-1">mdi-refresh</v-icon>
          Réinitialiser
        </v-btn>
      </div>
    </v-navigation-drawer>
    <v-data-iterator :custom-filter="customFilter"
                     :items="items"
                     :items-per-page="5"
                     :loading="loading"
                     :search="search"
                     :sort-desc="sortDesc"
                     :style="$vuetify.breakpoint.xl ? 'width: 60%' : 'width: 100%'"
                     class="mb-8"
    >
      <template v-slot:header>
        <v-toolbar
          class="mb-4"
          color="#8e0088"
          dark
          flat
        >
          <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            bottom
            color="yellow"
          ></v-progress-linear>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-text-field v-model="search"
                        class="mr-2"
                        clearable
                        flat
                        hide-details
                        label="Rechercher un numéro"
                        prepend-inner-icon="mdi-magnify"
                        solo-inverted
          ></v-text-field>
          <v-btn-toggle
            v-model="sortDesc"
            mandatory
          >
            <v-btn
              :value="false"
              color="#8e0088"
            >
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn
              :value="true"
              color="#8e0088"
            >
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in getItems(props)"
            :key="item.lotId"
            cols="12"
          >
            <v-card outlined>
              <v-card-title class="subheading font-weight-bold">
                Lot n°{{ item.lotId }}
                <v-spacer/>
                <v-dialog
                  v-model="dialog[item.lotId]"
                  width="500"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="mx-2"
                      color="#8e0088"
                      dark
                      icon
                    >
                      <v-icon dark size="35">
                        mdi-chart-box
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-card class="pb-4">
                    <v-card-title>
                      Graphique | {{ item.lotId }}
                      <v-spacer/>
                      <v-btn
                        color="#8e0088"
                        dark
                        icon
                        @click="dialog[item.lotId] = false"
                      >
                        <v-icon dark>mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>
                    <graphic :value="item"/>
                  </v-card>
                </v-dialog>
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-data-table :headers="[
                                {text: 'Nom', value: 'libelle'},
                                {text: 'Dernier', value: 'valeur'},
                                {text: 'Heure', value: 'heure'},
                                {text: 'Somme', value: 'sum'}
                              ]"
                              :items="item.data"
                              hide-default-footer>
                  <template v-slot:[`item.heure`]="{item}">
                    <span>{{ item.heure | luxon(settings) }}</span>
                  </template>
                </v-data-table>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import Graphic from '@/components/Graphic'

export default {
  name: 'Datas',
  components: { Graphic },
  data () {
    return {
      // Iterator
      loading: true,
      dates: [],
      drawer: false,
      items: [],
      search: '',
      dialog: {},
      sortDesc: true,
      settings: {
        input: { format: 'yyyy-MM-dd HH:mm:ss', locale: 'fr', zone: 'local' },
        output: { locale: 'fr', format: 'dd/MM/yyyy HH:mm:ss', zone: 'local' }
      }
    }
  },
  watch: {
    dates () {
      if (this.dates) {
        if (this.dates.length === 1) {
          this.fetchData(this.dates[0], this.dates[0])
        } else if (this.dates.length === 2) {
          this.fetchData(this.dates[0], this.dates[1])
        }
      }
    }
  },
  methods: {
    fetchData (date1, date2) {
      this.loading = true
      const req = date1 && date2 ? `/api/v1/data?firstDate=${date1}&lastDate=${date2}` : '/api/v1/data'
      this.axios.get(req).then(v => {
        this.items = v.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    customFilter (item, search) {
      if (!search || (search && !search.length)) return item
      return item.filter(v => v.lotId.toString().includes(search.toString()))
    },
    getItems (props) {
      if (props.options.sortDesc[0]) return props.items.filter(v => v.lotId)
      else return props.items.filter(v => v.lotId).reverse()
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
