<template>
  <v-container>
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="5"
        class="elevation-1"
      ></v-data-table>
  </v-container>
</template>

<script>
export default {
  name: 'Datas',
  data () {
    return {
      headers: [],
      data: []
    }
  },
  created () {
    this.axios.get('/api/v1/data').then(v => {
      console.log(v)
    })
  }
}
</script>
