<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-spacer/>
      <div class="title">
        AMDM
      </div>
      <v-spacer/>
    </v-app-bar>

    <v-main>
      <Datas/>
    </v-main>
  </v-app>
</template>

<script>
import Datas from './components/Datas'

export default {
  name: 'App',

  components: {
    Datas
  }
}
</script>
