<template>
  <div class="raiz">
    <PokeList :imageUrl="imageUrl" />
    <PokeStart/>
  </div>
</template>

<script>
import PokeList from './view/PokeList'
import PokeStart from './view/PokeStart'

/* import axios from 'axios' */
/* import $ from 'jquery' */
export default {
  name: 'pokedex',
  components:{
    PokeList,
    PokeStart
  },
  
  data(){
    return {
     imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
    }
  },
}
</script>


<style lang="scss" scoped>
  body{
    background-color: black!important;
}

.raiz{
  position: relative;
  
}

@keyframes bounce {
    20% {
        transform: translateY(-6px);
    }
    40% {
        transform: translateY(0px);
    }

    80% {
        transform: translateY(-2px);
    }
    100% {
        transform: translateY(0);
    }
}




</style>
