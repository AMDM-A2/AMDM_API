<template>
  <v-container>
    <div class="d-flex justify-center flex-column align-content-center">
        <v-data-iterator
          :items="items"
        />

        <!-- <v-card max-width="900">
          <div id="chart">
            <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
          </div>
        </v-card> -->
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Datas',
  data () {
    return {
      // Iterator
      items: [],

      // Chart
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
      }
    }
  },
  created () {
    this.axios.get('http://localhost:3000/api/v1/data').then(v => {
      this.items = [{
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%'
      }]
      console.log(this.items)
    })
  }
}
</script>
