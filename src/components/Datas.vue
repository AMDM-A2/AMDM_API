<template>
  <v-container>
    <v-data-iterator :items="items"
                     :items-per-page="5"
                     :loading="loading"
                     :search="search"
                     :sort-desc="sortDesc"
                     :custom-filter="customFilter"
                     class="mb-8"
                     loading-text="Chargement des données"
                     no-data-text="Aucune donnée"
                     no-results-text="Aucun résultat"
    >
      <template v-slot:header>
        <v-toolbar
          class="mb-4"
          color="#8e0088"
          dark
          flat
        >
          <v-toolbar-title v-show="!$vuetify.breakpoint.mobile">Liste de lots</v-toolbar-title>
          <v-spacer v-show="!$vuetify.breakpoint.mobile"/>
          <v-text-field class="mr-2"
            v-model="search"
            clearable
            flat
            hide-details
            label="Rechercher"
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
                <v-data-table :items="item.data"
                              :headers="[
                                {text: 'Nom', value: 'typeProduit'},
                                {text: 'Dernier', value: 'valeur'},
                                {text: 'Somme', value: 'sum'}
                              ]"
                              hide-default-footer/>
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
      items: [],
      search: '',
      dialog: {},
      sortDesc: true
    }
  },
  methods: {
    customFilter (item, search) {
      return item.filter(v => JSON.stringify(v).toUpperCase().includes(search.toUpperCase()))
    },
    getItems (props) {
      if (props.options.sortDesc[0]) return props.items.filter(v => v.lotId)
      else return props.items.filter(v => v.lotId).reverse()
    }
  },
  created () {
    this.axios.get('/api/v1/data').then(v => {
      this.items = v.data
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  }
}
</script>
