<template>
  <div class="pokemon">
    <h1 class="titulo">Pokédex</h1>
    <div class="conteudo">
      <h3>Search Pokemon
          <!-- <font-awesome-icon :icon="['fa', 'search']"/> -->
         <!--  <i class="fas fa-search"></i> -->
      </h3>
      <div class="lista" >
        <div class="avatar">
            <div class="card">
                <img class="logo" height="200" width="200" src="../assets/pokedex-logo.jpg" alt="">
                <div class="tipo"></div> 
            </div>
        </div>
        <div class="linha" >
          <li :id="pokemon.id" :value="pokemon.id" v-for="(pokemon) in pokemons" :key="pokemon.id" >
            <span>ID: {{("000"+ pokemon.id).slice(-3)}}</span>
            <a class="pokemon" href="#"> {{pokemon.species.name.toUpperCase()}}    
                <img class="minuatura" height="40" width="40" :src="pokemon.sprites.front_default">
            </a>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


/* import $ from 'jquery' */
export default {
  name: 'pokedex',
  props: {
    msg: String
  },
  data(){
    return {
      pokemons: []
     
    }
  },
  created(){
    for(var i=1; i<=10; i++){
      
      let url = `https://pokeapi.co/api/v2/pokemon/${i}`
      this.$http.get(url)
        .then(res    => res.json())
        .then(data => this.pokemons.push(data), console.log(this.pokemons))
    }
    
  },
  methods:{
    /*renderiza(pokemon){
       var id = ("000"+ pokemon.id).slice(-3);
      var nome = pokemon.species.name.toUpperCase();
      var avatar = pokemon.sprites.front_default;
      console.log(pokemon.species.name)
    $(".linha").append(`
      <li id="${id}" value="${pokemon.id}">
          <span>ID: ${id}</span>
          <a class="pokemon" href="#"> ${nome}    
              <img class="minuatura" "height="40" width="40"src=${avatar}>
          </a>
      </li>`); */
      /* console.log(id)
      console.log(nome)
      console.log(avatar)
    } */
    
    
  },
  
}
</script>


<style lang="scss" scoped>
  body{
    background-color: black!important;
}


.titulo{
    font-size: 50px;
    color: rgb(253, 228, 0);
    text-shadow: rgb(0, 102, 255) 1px 0px 2px;
     -webkit-text-stroke-width: 1.0px;
    -webkit-text-stroke-color:  rgb(0, 102, 255);
    margin-top: 50px;
    text-align: center;
    font-weight: bolder;
}
.conteudo{
    background-image: url(../assets/pokedex-fundo.png);
    padding:  2px 5px 5px 5px;
    border-radius: 3px;
    width: 500px;
    height: 355px;
    background-color: whitesmoke;
    margin: 20px auto 0 auto;
    h3{
      position:relative;
      -webkit-text-stroke-width: .4px;
      -webkit-text-stroke-color: black;
      color: white;
      border: 3px solid black;
      
      margin: 0 auto 10px auto;
      text-align: center;
      background-image: linear-gradient(to bottom, rgb(2, 83, 206), rgb(26, 113, 225), rgb(2, 83, 206));
    }
    .lista{
      border-radius: 7px ;
      border: 3px solid black;
      width:490px;
      height: 300px;
      margin:auto;
      padding:0 ;
      background-color: whitesmoke;
      display:flex;
      text-decoration: none;
      overflow-y: auto;
      scrollbar-color: #ff2c2c rgb(219, 108, 108);
      -webkit-scrollbar-color: #ff2c2c rgb(219, 108, 108);
      scrollbar-width: thin;
      .avatar{
        display: flex;
        justify-content: center;
        position: sticky;
        top: 0;
        left: 0;
        margin:0;
        width: 230px;
        background-color: transparent;
        .maisinfo{
          position: absolute;
          cursor: pointer;
          bottom: 0;
          width: 220.5px;
          line-height: 37px;
          order: 1;
          background-image: linear-gradient(to bottom, rgb(2, 83, 206), rgb(26, 113, 225), rgb(2, 83, 206));
          text-align: center;
          color: white;
          margin-top: 20px;
          transition: all 0.5s;
          &:active{
            transition: all 0s;
            color: black;
            background-image: linear-gradient(to bottom, rgb(164, 177, 200), rgb(180, 200, 227), rgb(164, 177, 200));
          }
        }
        .card{
          z-index:-1;
          padding: 25px 20px 50px 20px;
          width: 220px;
          display: flex;
          align-items: center;
          background-color: transparent;
          border-radius: 0!important;
          .logo{
            margin:20px;
            height: 200px;
            width: 200px;
          }
          .avatar-card{
            cursor: pointer;
            margin-top: -3px;
            height: 96px!important;
            width:96px!important;
            animation: bounce 0.5s linear;
            &:hover{
              animation: bounce 0.5s linear;
            }
          }
          .stats-name{
            margin-left: -5px;
          }
          .tipo{
            display: flex;
            order: 1;
          }
          .nome-tipo{
            margin: 5px;
            padding: 5px 8px 8px 8px;
            line-height: 8px;
            border-radius: 15px;
            background-color: lightgray;
            text-align: center;
            width: 90px!important;
            order:1;
          }
          
        }
      }
      .linha{
        list-style-type: none;
        line-height: 40px;
        width: 55%;
        li{
          cursor: pointer;
          width:247px;
          background-color: #ff2c2c; 
          border-left:  3px solid black;
          display: flex;
          justify-content: flex-end;
          span{padding-left: 5px;
            border-left: 5px solid rgb(219, 108, 108);
            background-color: whitesmoke;
          }
           a{
            text-align:right;
            width: 165px;
            padding-left: 10px;
            background-color: whitesmoke;
            color: black;
            &:hover{
              background-color: whitesmoke;
              text-decoration: none;
              color: black;
            }
          }
        }
      }

    }

}

.conteudo h3 i{
    
    opacity: 0.8;
    position: absolute;
    right: 16px;
    top: 3px;
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
