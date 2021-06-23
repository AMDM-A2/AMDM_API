<template>
  <div id="chart">
    <apexchart :options="chartOptions" :series="series" height="300" type="area"></apexchart>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  name: 'Graphic',
  props: ['value', 'dateD', 'dateF'],
  created () {
    this.axios.get('/api/v1/services/lots/' + encodeURI(this.value.lotId) + '/data').then((v) => {
      let min
      let max
      if (this.dateD != null && this.dateF != null) {
        min = this.dateD
        max = this.dateF

        if (min > max) {
          const tmpMax = max
          max = min
          min = tmpMax
        }

        this.chartOptions = { ...this.chartOptions, ...{ xaxis: { min: DateTime.fromFormat(min, 'yyyy-MM-dd', { locale: 'fr' }).toMillis(), max: DateTime.fromFormat(max, 'yyyy-MM-dd', { locale: 'fr' }).toMillis() } } }
      }

      // this.chartOptions.xaxis.min = DateTime.fromFormat(min, 'yyyy-MM-dd', { locale: 'fr' }).toMillis()
      // this.chartOptions.xaxis.max = DateTime.fromFormat(max, 'yyyy-MM-dd', { locale: 'fr' }).toMillis()

      console.log(this.chartOptions.xaxis.min, this.chartOptions.xaxis.max)

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
