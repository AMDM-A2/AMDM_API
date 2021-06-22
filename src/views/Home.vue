<template>
  <div class="d-flex flex-column justify-center align-content-center fill-height">
    <kinesis-container v-if="!$vuetify.breakpoint.mobile" style="text-align: center;">
      <kinesis-element :strength="20" :style="$vuetify.theme.dark ? 'color: deeppink' : 'color: #8e0088'"
                       style="font-family: Staatliches,sans-serif; font-size: 8vh;">
        <div :class="$vuetify.theme.dark ? 'title_shadow' : null">Malaxage</div>
      </kinesis-element>
      <kinesis-element :class="$vuetify.theme.dark ? 'title_shadow' : null" :strength="10"
                       style="font-family: Potta One,sans-serif;font-size: 4vh; color: #d53f90"
                       type="rotate">
        1.0
      </kinesis-element>
      <div :style="`transform: rotate(${size}deg)`" @click="b++">
        <kinesis-element
          :strength="-10"
          axis="x"
          src="/img/logo.png"
          style="height: 100px"
          tag="img"
          transformOrigin="50% 300%"
          type="rotate"/>
      </div>
    </kinesis-container>
    <div v-else style="text-align: center;">
      <div :class="$vuetify.theme.dark ? 'title_shadow' : null"
           :style="$vuetify.theme.dark ? 'color: deeppink' : 'color: #8e0088'"
           style="font-family: Staatliches,sans-serif; font-size: 8vh;">Malaxage
      </div>
      <v-img style="margin: auto;" :style="`transform: rotate(${size}deg)`" src="/img/logo.png" width="150px" @click="b++"></v-img>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  watch: {
    b () {
      this.size = this.size - 1
      if (this.b === 10) {
        this.size = 0
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        this.b = 0
        this.$cookies.set('theme', this.$vuetify.theme.dark)
      }
    }
  },
  data () {
    return {
      size: 0,
      b: 0
    }
  }
}
</script>

<style scoped>
.title_shadow {
  text-shadow: #FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 15px, #FF2D95 0px 0px 20px, #FF2D95 0px 0px 30px, #FF2D95 0px 0px 40px, #FF2D95 0px 0px 50px, #FF2D95 0px 0px 75px;
}
</style>
