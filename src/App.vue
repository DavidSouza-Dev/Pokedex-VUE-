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
 body{
    background-color: black!important;
    margin: 0;
    padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: linear-gradient(to bottom, rgb(119, 118, 118),rgb(233, 233, 233)); 
  margin: 0;
  padding: 0;
  position: fixed;
  width: 100%;
  height: 100vh
}
</style>
