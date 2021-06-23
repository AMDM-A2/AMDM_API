<template>
  <div class="mt-4 pa-2 mb-15">
    <v-list width="600" elevation="5" class="rounded-xl">
      <v-subheader>Alertes</v-subheader>
      <v-progress-linear
        :active="loading"
        class="ml-2 mr-2"
        :indeterminate="loading"
        color="pink"
      ></v-progress-linear>
      <v-list-item-group
        v-model="selectedItem"
        color="primary"
      >
        <v-list-item v-for="(alert) in alerts"
                     :key="`alert_${alert.id}`"
                     @click.stop="dialog = true"
        >
          <v-list-item-avatar>
            <v-icon>mdi-alert</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Alerte {{ alert.id }}</v-list-item-title>
            <v-list-item-subtitle style="font-size: 12px">{{ alert.date | luxon(settings) }}</v-list-item-subtitle>
            <small v-if="alert.description && alert.description.length"
                   style="font-family: monospace">{{
                alert.description.slice(0, 25)
              }}{{ alert.description.length >= 25 ? '...' : '' }}</small>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Modifier l'alerte {{ selectedItem + 1 }}
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
  </div>
</template>

<script>
export default {
  name: 'AlertConfig',
  watch: {
    dialog () {
      if (this.dialog === false) {
        setTimeout(() => {
          this.selectedItem = null
        }, 100)
      }
    },
    selectedItem () {
      if (this.selectedItem) {
        this.description = this.alerts.find(v => v.id === (this.selectedItem + 1)).description || ''
      }
    }
  },
  data () {
    return {
      loading: false,
      description: '',
      dialog: false,
      selectedItem: null,
      alerts: null,
      settings: {
        input: { format: 'yyyy-MM-dd HH:mm:ss', locale: 'fr', zone: 'local' },
        output: { locale: 'fr', format: 'dd/MM/yyyy HH:mm:ss', zone: 'local' }
      }
    }
  },
  methods: {
    fetchAlerts () {
      this.loading = true
      this.axios.get('/api/v1/alerts').then(v => {
        this.alerts = v.data.results
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    setAlert () {
      this.axios.patch('/api/v1/alert', { id: this.selectedItem + 1, description: this.description }).then(v => {
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
