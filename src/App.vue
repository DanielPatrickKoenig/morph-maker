<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <ShapeMaker />
    
  </div>
</template>

<script>
import ShapeMaker from './components/ShapeMaker.vue'

export default {
  name: 'App',
  components: {
    ShapeMaker
  }
}
</script>

<style lang="scss">
@import './scss/app.scss';
</style>
