<template>
  <v-container>
    <v-navigation-drawer
      right
      v-model="drawer"
      clipped
      fixed
      width="290"
    >
      <div :style="!$vuetify.breakpoint.mobile ? `margin-top: ${$vuetify.application.top}px` : null">
        <v-date-picker v-model="dates" color="#8e0088" locale="fr" range
                       selected-items-text="Sélection"></v-date-picker>
        <div class="pa-2">
        <v-btn block color="#8e0088" outlined @click="dates = [];">
          <v-icon class="mr-1">mdi-refresh</v-icon>
          Réinitialiser
        </v-btn>
        </div>
        <div class="pa-2" v-if="sensors">
          <span>Liste des produits</span>
          <v-list dense>
            <v-list-item-group
              v-model="selectedSensor"
              color="primary"
            >
            <v-list-item dense v-for="sensor in sensors" :key="`sensor_${sensor.id}`">
              <v-list-item-title>{{ sensor.libelle }}</v-list-item-title>
            </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </div>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn text block @click="drawer = false" color="#8e0088"><v-icon class="mr-1">mdi-close</v-icon>Fermer</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-data-iterator
                     :items="items"
                     :items-per-page="5"
                     :loading="loading"
                     loading-text="Chargement des données..."
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
            class="mr-4"
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
          <v-icon @click.stop="drawer = !drawer">mdi-filter</v-icon>
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
                  width="600"
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
                    <graphic class="pa-4" :value="item" :dateD="dates[0]" :dateF="dates.length === 1 ? dates[0] : dates[1]"/>

                  </v-card>
                </v-dialog>
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-data-table :headers="[
                                {text: 'Nom', value: 'libelle'},
                                {text: 'Dernier', value: 'valeur'},
                                {text: 'Heure', value: 'date'},
                                {text: 'Somme', value: 'sum'}
                              ]"
                              :items="item.data"
                              hide-default-footer>
                  <template v-slot:[`item.date`]="{item}">
                    <span>{{ item.date | luxon(settings) }}</span>
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
      selectedSensor: null,
      sensors: null,
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
      this.fetchData()
    },
    selectedSensor () {
      this.fetchData()
    },
    search () {
      this.fetchData()
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      const req = '/api/v1/data'
      const params = {}
      if (this.selectedSensor != null && this.sensors && this.sensors[this.selectedSensor] != null) params.sensor = this.sensors[this.selectedSensor].id
      if (this.dates) {
        if (this.dates.length === 1) {
          params.firstDate = this.dates[0]
          params.lastDate = this.dates[0]
        } else {
          params.firstDate = this.dates[0]
          params.lastDate = this.dates[1]
        }
      }
      if (this.search && this.search.length) params.search = this.search
      this.axios.get(req, { params }).then(v => {
        this.items = v.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getItems (props) {
      if (props.options.sortDesc[0]) return props.items.filter(v => v.lotId)
      else return props.items.filter(v => v.lotId).reverse()
    }
  },
  mounted () {
    this.axios.get('/api/v1/sensors').then(v => {
      this.sensors = v.data
    })
  },
  created () {
    this.fetchData()
  }
}
</script>
