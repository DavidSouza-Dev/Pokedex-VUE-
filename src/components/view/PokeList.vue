<template>
  <div class="pokemon">
    <h1 class="titulo">Pokédex</h1>
    <div class="conteudo">
      <form class="form" @click="show=false, erroModal=false " @submit.prevent="startModalEffect">
        <input type="search" id="filtro" autocomplete="off" v-model.lazy.trim="filter" placeholder="Search Pokemon by Id or Name">
        <button class="icon" >
          <font-awesome-icon :icon="['fas', 'search']"/>
        </button>
      </form>
      <div class="lista" >
        <!-- lista de pokemons -->

        <ul class="linha" >
          <li class="poke" v-for="(pokemon,index) in pokemons " :key="index" >
            <h3 class="poke" @click="clickPokemon(pokemon.url), loadShow=!loadShow, modalEffect(show) " ><span>#{{("000"+ (index+1)).slice(-3)}}</span> {{pokemon.name}} 
              <img :src="imageUrl + (index+1) + '.png'" height="40" width="40">
            </h3>
          </li>
          <div class="scroll" ref="infinitescroll"></div>
        </ul>

        <!-------------------- MODAL ------------------->
        <!-- efeito load -->

        <div class="charge"  v-show="loadShow">
          <img src="../../static/POKEBALL.png" alt="">
          <div class="load">Loading...</div>
        </div>

        <!-- Pokemon não encontrado -->

        <div class="nao-encontrado" v-show="erroModal" @click="erroModal=!erroModal">
          <div class="mensagem">Pokemon não encontrado! Tente Novamente.
            <img src="../../static/pngguru.com.png"  height="70" width="60" alt="">
          </div>
        </div>

        <!-- Detalhes da procura -->
        <div class="modalDetalhes" v-show="show" @click="show=!show, zeraModal(),renderizaCorTipo()">
          <div class="fechar">
            <font-awesome-icon :icon="['fas', 'times']"/>
          </div>
          <img class="avatar " id="animate" :src="imageUrl+pokemon.id+'.png'" ref="avatarpoke">
          <div class="sombra"></div>
          
          <div class="detalhes">
            <span class="nome">#{{pokemon.id}} {{pokemon.nome}} {{teste}}</span>

            <!-- CARACTERISTICAS -->
            <div class="caracteristicas">
              <span class="peso">Weight: {{pokemon.peso}} Ib's</span>
              <span class="altura">Height: {{pokemon.altura}}'</span>
              <span class="tipo" v-for="(tipo,id) in pokemon.tipo" :key="id"  >
                {{tipo}}
              </span>
            </div>
            
            <!-- STATUS -->
            <div class="card-status">
              <div class="status" v-for="(stat,id) in pokemon.stats" :key="id">
                <div v-if="id % 2 == 0" style="color:black">{{stat}}</div>
                <div v-else-if=" id % 2 == 1" style="backgroundColor:gray" :style="{width: `${stat}`+'px', height:10+'px'}"></div >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyrights">Developed by David Souza</div>
  </div>
</template>

<script>

import axios from 'axios'
import $ from 'jquery'

export default {
  name: 'pokedex',
  props: [
    'imageUrl',
    
  ],
  data(){
    return {
      url:"https://pokeapi.co/api/v2/pokemon",
      pokemons: [],
      nextUrl: '',

      urlFilter:'https://pokeapi.co/api/v2/pokemon',
      teste:'',
      searchUrl: '',

      filter:'',
      erroFilter:'',
      erroModal:false,
      loadShow:false,
      show:false,

      pokemon:{
        id:'',
        nome:'',
        tipo:[],
        peso:'',
        altura:'',
        stats:[]
      }
    }
  },

  created(){
    this.createPokeList();
   
    
  },

  computed:{
    //Esta propertie vai avaliar o comportamento de filter que fará iteração na lista retornando um true ou false
    pokemonList(){ 
      if (this.filter){ //\b[a-zA-z]*\b

        let exp = new RegExp(this.filter.trim(), "i")
        let result = this.pokemons.filter(pokemon => exp.test(pokemon.name || pokemon.id))
        this.detectError(result)
        
        return this.pokemons
      }
      else{
        return this.pokemons
      }
    }
},

  methods:{
  createPokeList(){
    axios.get(this.url)
    .then(res => {
      let data = res.data
      this.nextUrl = data.next;
      data.results.forEach(pokemon => {
        this.pokemons.push(pokemon)
      });
    })
  },

  clickPokemon(pokedata){  
    
    //zera a propriedade pokemon que renderiza o modal
    /************************************************/
    this.pokemon = {
      id:'',
      nome:'',
      tipo:[],
      peso:'',
      altura:'',
      stats:[]
    }
    /************************************************/

    axios.get(pokedata)
    .then(res => {
      let info = res.data
      console.log(info)
      this.pokemon.id = info.id
      this.pokemon.nome = info.name;
      info.types.forEach(dados => this.pokemon.tipo.push(dados.type.name));
      this.pokemon.peso = info.weight;
      this.pokemon.altura = info.height;
      var status = info.stats
      status.forEach(dados => this.pokemon.stats.push(dados.stat.name,dados.base_stat));

    })
  },

  modalBySearch(show){
    let urlSearch = `${this.urlFilter.trim()}/${this.filter}`
    this.teste = urlSearch
    console.log("teste 123"+urlSearch)
    console.log("testeteste"+ typeof this.filter)
   this.modalEffect(show)
   this.clickPokemon(urlSearch)
  },

  //Responsável por criar o efeito de scroll infinito
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
  //alimenta a lista de pokemons
  next(){
    /* console.log(this.url) */
    this.url = this.nextUrl;
    this.createPokeList();
  },

  nextSearch(){
    if(this.urlNext == ''){
      this.urlNext = this.url;
      this.fullSearchList();
    }else{
      this.urlNext = this.fullNextUrl
      this.fullSearchList();
    }
    
    
  },

  //Cria um modal com descrição

  //Cria um efeito de loading associado ao setTimeout
  startModalEffect(){
    this.loadShow=!this.loadShow;
    this.modalBySearch()
  },
  
  modalEffect(valorBoolean){
    setTimeout(() => {
      this.filter ='';
      this.loadShow=!this.loadShow;
      this.show = !valorBoolean;
    }, 1500)
  },

  //Gera um aviso de erro
  errorSearch(){
    
    setTimeout(() => {
      this.filter ='';
      this.loadShow=!this.loadShow;
      this.show = false;
      this.erroModal=!this.erroModal;
    },1000)
  },

  //avalia o value inserido no form gerando um estado
  detectError(result){
   /*  if(result[0].url){
      this.modalEffect()
      this.clickPokemon(result[0].url)
    }else */
    if(result[0] == undefined/*  && this.fullPokeList.next != null */){
     /*  this.errorSearch() */
     
     
    }else
    {
     /*  this.modalEffect()
      this.clickPokemon(result[0].url) */
    }
  },

   
  //Zera o modal para próxima renderização
  zeraModal(){
    this.pokemon = {
      id:'',
      nome:'',
      tipo:[],
      peso:'',
      altura:'',
      stats:[]
    }
  },
 
  //TODO
  renderizaCorTipo(){
    let tipo = this.pokemon.tipo;
    switch (tipo) {
      case 'normal':
        $(".tipo").css({backgroundColor:"gray"}) 
        break;
      case 'fire':
        $(".tipo").css({backgroundColor:"orange"});
        break;
    } 
  },

  efeito(){
    $(".poke").click(function(){
      console.log("teste")
    })
  }
    
  },
  mounted(){
    
    this.eventScroll();
    this.efeito();
  }
  
}
</script>


<style lang="scss" scoped>
 
.pokemon{
  position: relative;
  .copyrights{
    position: absolute;
    bottom:-98px;
    right: 36px;
    font-size: 10px;
    opacity: .7;

  }
}

.titulo{
    font-size: 50px;
    color: #ffde21f3;
    text-shadow: #e9e9e9 1px 0px 2px;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #00378d;
    margin-top: 15px;
    margin-bottom: 5px;
    text-align: center;
    font-weight: bolder;
}
.conteudo{
  position: relative;
    padding:  2px 5px 5px 1px;
    border-radius: 3px;
    width: 90%;
    max-width: 343.5px;
    height: 530px;
    /* background-color: white; */
    margin: 10px auto 0 auto;
    .form{
      display: flex;
      line-height: 1;
      width: 100%;
      height: 40px;
      color: white;
      background-color: white;
      border: 2px solid black;
      border-radius: 7px 7px 0 0 ;
      margin: 0;
      text-align: center;
      input{
        border-radius: 7px 7px 0 0;
        padding-left: 2rem;
        width: 90%;
        height: inherit;
        border:none
      }
      .icon{
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: scale(.8);
        color: #05050580;
        background-color: white;
        font-size: 10px;
        height: inherit;
        width: 10%;
        border:none;
        svg{
          /* width: 50px; */
          height: 23px;
        }
        &:hover,&:focus{
          color:black;
        }
        
      }
     /*  background-image: linear-gradient(to bottom, rgb(2, 83, 206), rgb(26, 113, 225), rgb(2, 83, 206)); */
    }
    .lista{
      display: flex;
      justify-content: center;
      border-radius:0 0 7px  7px ;
      border: 2px solid black;
      border-top: none;
      width:100%;
      height: 508px;
      margin:auto;
      padding:0 ;
      background-color: #13232a;
      display:flex;
      text-decoration: none;
      overflow-y: auto;
      scrollbar-color: #2e2e2e rgb(199, 199, 199);
      -webkit-scrollbar-color: #2e2e2e rgb(199, 199, 199);
      scrollbar-width: thin;
      
      .linha{
        margin: 3px 0;
        padding-left: 0px;
        list-style-type: none;
        line-height: 40px;
        width:97%;
        li{
          cursor: pointer;
          width:100%;
          display: flex;
           
          h3{
            
            z-index: 2!important;
            color:rgb(253, 253, 253);
            text-shadow: #0c0c0c 1px 0px 2px;
            -webkit-text-stroke-width: 2px;
            -webkit-text-stroke-color: #00378d;
            text-transform: capitalize;
            width: 100%;
            margin: 1px 0;
            border:none;
            border-radius: 4px;
            display: flex;
            justify-content: flex-start;
            padding-right: 1rem;
            padding-left: 0.2rem;
            background-image: linear-gradient(to bottom, hsl(207, 61%, 41%), #4d7ea7,
             hsl(207, 61%, 41%));
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
    .charge{
      z-index: 99;
      position: absolute;
      left: 2.8px;
      width: 98.2%;
      height: 94.6%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.233);
      
      img{
        height: 40px;
        width: 40px;
        animation: load .9s linear;
        animation-iteration-count: infinite;
      }
      .load{
        font-size: 28px;
        font-weight: bold;
        color: red;
        background:#ffffffd4;
        margin-top: 25px;
        border-radius: 17px;
        width: 151px;
        height: 43px;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: loadColor .9s linear;
        animation-iteration-count: infinite;
      }
    }
    .nao-encontrado{
      z-index: 99;
      position: absolute;
      left: 2.8px;
      width: 98.2%;
      height: 94.6%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.233);
      .mensagem{
        background: white;
        width: 90%;
        height: 200px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 21px;
        font-weight: bold;
      }

    }

    @keyframes loadColor {
      0%{
        color: red;
        font-size: 28px;
      }
      50%{
        color: black;
        font-size: 25px;
      }
      100%{
        color: red;
        font-size: 28px;
      }
      
    }
    @keyframes load {
      from {
        -webkit-transform: rotate(0deg)
      }
      to {
        -webkit-transform: rotate(360deg)
      }
    }
    .modalDetalhes{
      position: relative;
      z-index: 999;
      position: absolute;
      left: 2.8px;
      width: 98.2%;
      height: 94.6%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.336);
      background-image: radial-gradient(circle at 50% 32%, #286da7 43%, #2c2c30 73%);
      border-radius:0 0 3px 3px;
      
       @media only screen and (max-width: 375px){
        width: 98.5%;
      }
      .fechar{
        position: absolute;
        top:15px;
        right: 15px;
        width: 30px;
        height: 30px;
        color: #0009;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.19);
        border-radius: 50%;
        transition: all .2s ease-in;
        &:hover,&:focus{
          color:black;
          background-color: rgba(255, 255, 255, 0.664);
        }
        svg{
          height: 23px;
        }

      }
      .avatar{
        animation: bounce 0.5s .7s linear;
        width: 96px;
        background-color: transparent;
        
      }
      #animate{
        animation: bounce 0.5s .7s linear;
        
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

      .sombra{
        background-image: radial-gradient(closest-side at 49% 67% ,#1b1b1b 3px, transparent 60%);
      }
      .detalhes{
        width: 98%;
        height: 68%;
        background-color: whitesmoke;
        border-radius: 10px;
        /* margin: auto 5px 10px 5px; */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        .nome{
          text-transform: uppercase;
          font-weight: bold;
        }
        .caracteristicas{
          display: flex;
          flex-wrap: wrap;
          width: 92%;
          justify-content: space-evenly;
          span{
            margin:5px;
            text-transform: capitalize;
            background-color: #c8c1c1;
            border-radius: 10px;
            width: 90px;
            height: 24px;
            white-space: nowrap;
            display: flex;
            justify-content: center;
            align-items: center;
          }
           span:nth-child(1), span:nth-child(2){
              background-color: transparent!important;
              width: 120px;
              
            }
        }
        .card-status{
          width: 70%;
          height: 215px;
          .status:nth-child(odd){
            text-align: left;
            text-transform: uppercase;
          }
          .status:nth-child(even){
            div{
              border-radius: 10px;
              background-image: linear-gradient(to right,  #286da7 50%, #0a1b29);
              margin-bottom: 8px;
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






</style>
