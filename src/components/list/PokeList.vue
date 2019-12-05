<template>
  <div class="pokemon">
    <h1 class="titulo">Pokédex</h1>
    <div class="conteudo">
      <h3>Search Pokemon
          <!-- <font-awesome-icon :icon="['fa', 'search']"/> -->
         <!--  <i class="fas fa-search"></i> -->
      </h3>
      <div class="lista" >
        <!-- lista de pokemons -->
        <ul class="linha" >
          <li class="poke" v-for="(pokemon,index) in pokemons " :key="index" >
            <h3 class="poke" @click="clickon(pokemon.url), show=!show " ><span>#{{("000"+ (index+1)).slice(-3)}}</span> {{pokemon.name}} 
              <img :src="imageUrl + (index+1) + '.png'" height="40" width="40">
            </h3>
          </li>
          <div class="scroll" ref="infinitescroll"></div>
        </ul>
        <!-- MODAL -->
        <div class="modalDetalhes" v-show="show" @click="show=!show">
          <img class="avatar" :src="img" ref="avatarpoke">
          
          <div class="sombra"></div>
          
          <div class="detalhes">
            <span class="nome">{{pokemon.nome}}</span>
            <div class="caracteristicas">
              <span class="peso">{{pokemon.peso}}</span>
              <span class="tipo" v-for="(tipo,id) in pokemon.tipo" :key="id" >
                {{tipo}}
              </span>
              <span class="altura">{{pokemon.altura}}</span>
            </div>
            
            <div class="status" v-for="(stat,id) in pokemon.stats" :key="id">
              {{stat}} 
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
/* import $ from 'jquery' */
export default {
  name: 'pokedex',
  props: [
    'imageUrl',
    
  ],
  data(){
    return {
      pokemons: [],
      nextUrl: '',
      url:"https://pokeapi.co/api/v2/pokemon",
      name:'',
      img:'',
      show:false,
      currentUrl: '',
      pokemon:{
        nome:'',
        tipo:[],
        peso:'',
        altura:'',
        stats:[]

      }
    }
  },
  created(){
    this.buscaDados();
    
  },
  methods:{
   
  buscaDados(){
    axios.get(this.url)
      .then(res => {
        let data = res.data
        this.nextUrl = data.next;
        data.results.forEach(pokemon => {
          /* pokemon.id = pokemon.url.split('/')
            .filter(function(part) { return !!part;  }).pop()
            console.log(pokemon) */
          this.id = pokemon.id;
          this.pokemons.push(pokemon)
          /* console.log(this.pokemons) */
        });
      })
  },
  eventScroll(){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry =>{
        if(entry.intersectionRatio > 0 && this.nextUrl){
          this.next();
        }
      });
    });

    observer.observe(this.$refs.infinitescroll)
  },
  next(){
    this.url = this.nextUrl;
    this.buscaDados();
  },
  clickon(pokedata){
    
    axios.get(pokedata)
    .then(res => {
      let info = res.data
      /* console.log(info) */
      this.img = info.sprites.front_default //tem q mudar esse endereço
      this.pokemon.nome = info.name;
      info.types.forEach(type => 
        this.pokemon.tipo.push(type.type.name
      ));
      this.pokemon.peso = info.weight;
      this.pokemon.altura = info.height;
      var status = info.stats
      /* console.log(status[0].base_stat) */
      status.forEach(stat => this.pokemon.stats.push(stat.stat.name,stat.base_stat));

      
    })
    
  }
    
  },
  mounted(){
    this.eventScroll();
   
  }
  
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
  position: relative;
    background-image: url(../../assets/pokedex-fundo.png);
    padding:  2px 5px 5px 1px;
    border-radius: 3px;
    width: 310px;
    height: 530px;
    background-color: whitesmoke;
    margin: 20px auto 0 auto;
    h3{
     
      -webkit-text-stroke-width: .4px;
      -webkit-text-stroke-color: black;
      color: white;
      border: 3px solid black;
      margin: 0 auto 1px auto;
      text-align: center;
      background-image: linear-gradient(to bottom, rgb(2, 83, 206), rgb(26, 113, 225), rgb(2, 83, 206));
    }
    .lista{
      
      border-radius: 7px ;
      border: 3px solid black;
      width:310px;
      height: 500px;
      margin:auto;
      padding:0 ;
      background-color: whitesmoke;
      display:flex;
      text-decoration: none;
      overflow-y: auto;
      scrollbar-color: #2e2e2e rgb(199, 199, 199);
      -webkit-scrollbar-color: #2e2e2e rgb(199, 199, 199);
      scrollbar-width: thin;
      
      .linha{
        margin: 0;
        padding-left: 0px;
        list-style-type: none;
        line-height: 40px;
        width:100%;
        li{
         
          cursor: pointer;
          width:100%;
          display: flex;
          
          h3{
            z-index: 99!important;
            color:rgba(0, 0, 0, 0.712);
            text-transform: capitalize;
            width: 100%;
            margin: 1px 0;
            border:none;
            display: flex;
            justify-content: flex-start;
            padding-right: 1rem;
            padding-left: 0.2rem;
            background-image: linear-gradient(to bottom, rgb(202, 201, 201), rgb(223, 223, 223),
             rgb(202, 201, 201));
            -webkit-text-stroke-width: .4px;
            -webkit-text-stroke-color: transparent;
            justify-content: flex-end;
          }
          span{
            padding-left: 1rem;
            margin-right: auto;
           
          }
          img{
            margin-left: 1.2rem;
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
    .modalDetalhes{
      z-index: 99;
      position: absolute;
      left: 2.6px;
      width: 99%;
      height: 93.2%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.336);
      background-image: radial-gradient(circle at 50% 32%, #286da7 43%, #2c2c30 73%);
      border-radius: 3px;
      .avatar{
        width: 96px;
        background-color: transparent;
        
      }
      .sombra{
        background-image: radial-gradient(closest-side at 49% 67% ,#1b1b1b 3px, transparent 60%);
      }
      .detalhes{
        width: 98%;
        height: 65%;
        background-color: whitesmoke;
        border-radius: 10px;
        /* margin: auto 5px 10px 5px; */

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
