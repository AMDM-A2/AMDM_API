<template>
  <v-container>
    <v-data-iterator :items="alerts" :items-per-page="7"
                     :loading="loading"
                     :style="$vuetify.breakpoint.xl ? 'width: 60%' : 'width: 100%'"
                     class="mb-8"
                     loading-text="Chargement des données..."
    >
      <template v-slot:header>
        <v-toolbar
          class="mb-4"
          color="primary"
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
                        label="Rechercher un numéro d'alerte"
                        prepend-inner-icon="mdi-magnify"
                        solo-inverted
          ></v-text-field>
          <v-dialog
            v-model="dialogAdd"
            persistent
            max-width="600px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="pink"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Créer une nouvelle alerte</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Identifiant du lot*"
                        v-model="idNewAlert"
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Description*"
                        v-model="descriptionNewAlert"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*requis</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialogAdd = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialogAdd = false; createAlert();"
                >
                  Ajouter
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>        </v-toolbar>
      </template>
      <template v-slot:default="props">
        <div class="d-flex justify-center align-content-center">
          <v-list class="rounded-xl" elevation="5" width="100%">
            <v-subheader>Alertes</v-subheader>
            <v-list-item-group
              color="primary"
            >
              <v-list-item v-for="alert in props.items"
                           :key="`alert_${alert.id}`"
                           @click.stop="dialog = true; selectedItem = alert.id"
              >
                <v-list-item-avatar>
                  <v-icon>mdi-alert</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Alerte {{ alert.id }}</v-list-item-title>
                  <v-list-item-subtitle style="font-size: 12px">{{
                      alert.date | luxon(settings)
                    }}
                  </v-list-item-subtitle>
                  <small v-if="alert.description && alert.description.length"
                         style="font-family: monospace">{{
                      alert.description.slice(0, 25)
                    }}{{ alert.description.length >= 25 ? '...' : '' }}</small>
                  <small v-else class="font-italic grey--text">Aucune description</small>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </template>
    </v-data-iterator>
    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Modifier l'alerte {{ selectedItem }}
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-textarea
                  v-model="description"
                  label="Description"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="grey darken-1"
            text
            @click="dialog = false"
          >
            Annuler
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false; setAlert()"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'AlertConfig',
  watch: {
    dialog () {
      if (this.dialog === false) {
        setTimeout(() => {
          this.selectedItem = null
        }, 50)
      }
    },
    selectedItem () {
      if (this.selectedItem && this.alerts && this.alerts.length) {
        this.description = this.alerts.find(v => v.id === this.selectedItem).description || ''
      }
    },
    search () {
      this.fetchAlerts()
    }
  },
  data () {
    return {
      idNewAlert: '',
      descriptionNewAlert: '',
      loading: false,
      search: '',
      description: '',
      dialog: false,
      dialogAdd: false,
      selectedItem: null,
      alerts: [],
      settings: {
        input: { format: 'yyyy-MM-dd HH:mm:ss', locale: 'fr', zone: 'local' },
        output: { locale: 'fr', format: 'dd/MM/yyyy HH:mm:ss', zone: 'local' }
      }
    }
  },
  methods: {
    fetchAlerts () {
      this.loading = true
      this.axios.get('/api/v1/alerts', { params: { search: this.search && this.search.length ? this.search : undefined } }).then(v => {
        this.alerts = v.data.results
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    createAlert () {
      this.selectedItem = null
      this.axios.put('/api/v1/alert', { idLot: parseInt(this.idNewAlert), description: this.descriptionNewAlert }).then(() => {
        this.fetchAlerts()
      })
    },
    setAlert () {
      this.axios.patch('/api/v1/alert', {
        id: this.selectedItem,
        description: this.description
      }).then(() => {
        this.selectedItem = null
        this.fetchAlerts()
      }).catch(() => {
        this.selectedItem = null
        this.fetchAlerts()
      })
    }
  },
  created () {
    this.fetchAlerts()
  }
}
</script>

<style scoped>

</style>
