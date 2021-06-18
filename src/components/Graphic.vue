<template>
  <div id="chart">
    <apexchart :options="chartOptions" :series="series" height="300" type="area"></apexchart>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  name: 'Graphic',
  props: ['value'],
  created () {
    this.axios.get('/api/v1/services/lots/' + encodeURI(this.value.lotId) + '/data').then((v) => {
      this.series = v.data.map(v => ({ name: v.name, data: v.data }))
    })
  },
  data () {
    return {
      // Chart
      series: [],
      chartOptions: {
        chart: {
          type: 'area',
          stacked: false,
          height: 350,
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100]
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: '#8e8da4'
            },
            offsetX: 0
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        xaxis: {
          type: 'datetime',
          tickAmount: 8,
          min: DateTime.now().setLocale('fr').minus({ month: 3 }).toMillis(),
          max: DateTime.now().setLocale('fr').toMillis(),
          labels: {
            style: {
              fontSize: '11px'
            },
            rotate: 0,
            rotateAlways: false,
            formatter: function (val, timestamp) {
              return DateTime.fromMillis(timestamp).setLocale('fr').toFormat('dd LLL')
            }
          }
        },
        tooltip: {
          shared: true
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          offsetX: -10
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
