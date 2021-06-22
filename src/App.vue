<template>
  <v-app>
    <v-app-bar
      app
      clipped-left
      color="white"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
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
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      :permanent="!$vuetify.breakpoint.mobile"
      expand-on-hover
    >
      <v-list
        dense
        nav
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item :to="{name: 'Home'}">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Accueil</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{name: 'Datas'}">
            <v-list-item-icon>
              <v-icon>mdi-chart-box</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Statistiques</v-list-item-title>
          </v-list-item>

          <v-list-item link disabled>
            <v-list-item-icon>
              <v-icon>mdi-cogs</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Configuration</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main style="background-color: #fafafa">
      <router-view class="justify-center align-content-center d-flex"/>
    </v-main>
    <v-footer fixed padless>
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
export default {
  watch: {
    group () {
      this.drawer = false
    }
  },
  data () {
    return {
      drawer: false,
      group: null
    }
  }
}
</script>
