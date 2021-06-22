<template>
  <div class="d-flex flex-column justify-center align-content-center fill-height">
    <kinesis-container style="text-align: center;">
      <kinesis-element :strength="10" style="font-size: 8vh; color: #8e0088">Malaxage</kinesis-element>
      <kinesis-element :strength="20" style="font-size: 4vh; color: deeppink">Bienvenue</kinesis-element>
      <kinesis-element
        style="height: 100px"
        :strength="-10"
        axis="x"
        src="/img/logo.png"
        tag="img"
        transformOrigin="50% 300%"
        type="rotate"/>
    </kinesis-container>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>

</style>
