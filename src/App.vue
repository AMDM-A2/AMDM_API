<template>
  <v-app>
    <v-app-bar
      app
      color="white"
    >
      <v-img
        alt="Logo"
        class="shrink mr-2"
        contain
        src="@/assets/logo.png"
        transition="scale-transition"
        width="80"
      />
      <v-spacer/>
      <div class="title">
        Malaxage
      </div>
      <v-spacer/>
      <v-img
        alt="Logo GIM"
        class="shrink mr-2"
        contain
        src="@/assets/logo_gim.jpg"
        transition="scale-transition"
        width="80"
      />
    </v-app-bar>

    <v-main style="background-color: #fafafa">
      <Datas class="justify-center align-content-center d-flex"/>
    </v-main>

    <v-footer padless>
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Le Groupe A2</strong>
      </v-col>
    </v-footer>
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
