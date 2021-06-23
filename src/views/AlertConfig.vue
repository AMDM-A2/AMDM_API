<template>
  <div>
    <v-list width="400">
      <v-subheader>Alertes</v-subheader>
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
            <v-list-item-subtitle>{{ alert.date | luxon(settings) }}</v-list-item-subtitle>
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
            @click="dialog = false"
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
  data () {
    return {
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
  created () {
    this.axios.get('/api/v1/alerts').then(v => {
      this.alerts = v.data.results
    })
  }
}
</script>

<style scoped>

</style>
