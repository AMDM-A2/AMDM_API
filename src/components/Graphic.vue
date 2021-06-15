<template>
  <div id="chart">
    <apexchart :options="chartOptions" :series="series" height="300" type="pie"></apexchart>
  </div>
</template>

<script>
export default {
  name: 'Graphic',
  props: ['value'],
  created () {
    this.series = [this.value.totalProductA || 0, this.value.totalProductB || 0, this.value.totalProductC || 0]
  },
  data () {
    return {
      // Chart
      series: [0, 0, 0],
      chartOptions: {
        chart: {
          type: 'pie',
          height: 300
        },
        labels: ['Produit A', 'Produit B', 'Produit C']
      }
    }
  }
}
</script>

<style scoped>

</style>
