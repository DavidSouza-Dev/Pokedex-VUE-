<template>
  <div id="app">
    <Pokedex msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Pokedex from './components/Pokedex.vue'

export default {
  name: 'app',
  components: {
    Pokedex
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
 
}
</style>
