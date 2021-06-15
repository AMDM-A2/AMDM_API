<template>
  <v-container>
    <v-data-iterator
      :items="items"
      :items-per-page="5"
      :loading="loading"
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
          <v-toolbar-title>Liste de lots</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items.filter(v => v.lotId)"
            :key="item.name"
            cols="12"
          >
            <v-card outlined>
              <v-card-title class="subheading font-weight-bold">
                Lot n°{{ item.lotId }}
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item>
                  <v-list-item-content class="font-weight-bold">Alertes / Défaut :</v-list-item-content>
                  <v-list-item-content v-if="item.alert" class="align-end">
                    {{ item.alert }}
                  </v-list-item-content>
                  <v-list-item-content v-else class="align-end grey--text">
                    Aucune donnée
                  </v-list-item-content>
                </v-list-item>

                <v-divider class="ml-4 mr-4"/>

                <v-list-item>
                  <v-list-item-content class="font-weight-bold">Produit A :</v-list-item-content>
                  <v-list-item-content v-if="item.productA" class="align-end">
                    {{ item.productA }}
                  </v-list-item-content>
                  <v-list-item-content v-else class="align-end grey--text">
                    Aucune donnée
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content class="font-weight-bold">Produit B :</v-list-item-content>
                  <v-list-item-content v-if="item.productB" class="align-end">
                    {{ item.productB }}
                  </v-list-item-content>
                  <v-list-item-content v-else class="align-end grey--text">
                    Aucune donnée
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content class="font-weight-bold">Produit C :</v-list-item-content>
                  <v-list-item-content v-if="item.productC" class="align-end">
                    {{ item.productC }}
                  </v-list-item-content>
                  <v-list-item-content v-else class="align-end grey--text">
                    Aucune donnée
                  </v-list-item-content>
                </v-list-item>

                <v-divider class="ml-4 mr-4"/>

                <v-list-item>
                  <v-list-item-content class="font-weight-bold">Total Produit A :</v-list-item-content>
                  <v-list-item-content v-if="item.totalProductA" class="align-end">
                    {{ item.totalProductA }}
                  </v-list-item-content>
                  <v-list-item-content v-else class="align-end grey--text">
                    Aucune donnée
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content class="font-weight-bold">Total Produit B :</v-list-item-content>
                  <v-list-item-content v-if="item.totalProductB" class="align-end">
                    {{ item.totalProductB }}
                  </v-list-item-content>
                  <v-list-item-content v-else class="align-end grey--text">
                    Aucune donnée
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content class="font-weight-bold">Total Produit C :</v-list-item-content>
                  <v-list-item-content v-if="item.totalProductC" class="align-end">
                    {{ item.totalProductC }}
                  </v-list-item-content>
                  <v-list-item-content v-else class="align-end grey--text">
                    Aucune donnée
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>

    <!-- <v-card max-width="900">
      <div id="chart">
        <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
      </div>
    </v-card> -->
  </v-container>
</template>

<script>
export default {
  name: 'Datas',
  data () {
    return {
      // Iterator
      loading: true,
      items: []

      /* // Chart
      series: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
      }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
      }, {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
      }],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
        },
        yaxis: {
          title: {
            text: '$ (thousands)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return '$ ' + val + ' thousands'
            }
          }
        }
      } */
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
