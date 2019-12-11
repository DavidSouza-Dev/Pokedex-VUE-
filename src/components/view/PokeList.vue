<template>
  <div class="pokemon">
    <h1 class="titulo">Pokédex</h1>
    <div class="conteudo">
      <form class="form" @submit.prevent="filtroEfeitoModal">
        <input type="search" id="filtro" autocomplete="off" v-model.lazy="filter" placeholder="Search Pokemon by Id or Name">
        <button class="icon" >
          <font-awesome-icon :icon="['fas', 'search']"/>
        </button>
      </form>
      <div class="lista" >
        <!-- lista de pokemons -->
        <ul class="linha" >
          <li class="poke" v-for="(pokemon,index) in listaPokemon " :key="index" >
            <h3 class="poke" @click="clickOn(pokemon.url), loadShow=!loadShow, efeitoModal(show) " ><span>#{{("000"+ (index+1)).slice(-3)}}</span> {{pokemon.name}} 
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
        <div class="nao-encontrado" v-show="erroModal" @click="erroModal=false">
          <div class="mensagem">Pokemon não encontrado! Tente Novamente.
            <img src="../../static/pngguru.com.png"  height="70" width="60" alt="">
          </div>
          
        </div>
        <!-- Detalhes da procura -->
        <div class="modalDetalhes" v-show="show" @click="show=!show, zeraModal(),renderizaCorTipo()">
          <div class="fechar">
            <font-awesome-icon :icon="['fas', 'times']"/>
          </div>
          <img class="avatar" :src="img" ref="avatarpoke">
          <div class="sombra"></div>
          
          <div class="detalhes">
            <span class="nome">{{pokemon.nome}}</span>
            <!-- CARACTERISTICAS -->
            <div class="caracteristicas">
             <!--  <div class="mensagem">Pokemon não encontrado! Tente Novamente.
                <img src="../../static/pngguru.com.png"  height="70" width="60" alt="">
              </div>  --> 
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
                <div v-else-if=" id%2==1" style="backgroundColor:gray" :style="{width: `${stat}`+'px', height:10+'px'}"></div >
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
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
      pokemons: [],
      nextUrl: '',
      url:"https://pokeapi.co/api/v2/pokemon",
      name:'',
      img:'',
      currentUrl: '',
      filter:'',
      erroModal:false,
      loadShow:false,
      show:false,
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
    this.criaListaPokemon();
  },
  computed:{
    // Realiza a busca de pokemon
    listaPokemon(){ 
      if (this.filter){
        let exp = new RegExp(this.filter.trim(), "i")
        let result = this.pokemons.filter(pokemon => exp.test(pokemon.name))
        console.log(result[0].url )
        let urlArray = result[0].url.split('/')
        let menosUm = urlArray.splice(-2,1)
        let ultimo = menosUm.pop()
        var number = parseInt(ultimo,10)
        
        console.log(number)
        if(number > 0){
          this.clickOn(result[0].url)
        }else
        if($('.card-status').lenght == undefined){
          
          this.erroProcura()
        }
        return this.pokemons
      }
      else{//tem q retornar tela de erro
        return this.pokemons
      }
      

    }

  },
  methods:{
  criaListaPokemon(){
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
  next(){
    this.url = this.nextUrl;
    this.criaListaPokemon();
  },

  //Cria um modal com descrição
  clickOn(pokedata){     
    axios.get(pokedata)
    .then(res => {
      let info = res.data
      /* console.log(info) */
      this.img = info.sprites.front_default //tem q mudar esse endereço
      this.pokemon.nome = info.name;
      /* var total = $("caracteristicas").children()
      console.log(total) */
      info.types.forEach(type => {
        while(this.pokemon.tipo.lenght>0){
          console.log(this.pokemon.tipo)
          this.pokemon.tipo.pop()
        }
        this.pokemon.tipo.push(type.type.name)
        
      });
      /* console.log(this.pokemon.tipo) */
      this.pokemon.peso = info.weight;
      this.pokemon.altura = info.height;
      var status = info.stats
      /* console.log(status[0].base_stat) */
      
      status.forEach(stat => this.pokemon.stats.push(stat.stat.name,stat.base_stat));

    })
  },
  //Cria um efeito de loading ao clicar no pokemon
  efeitoModal(valorBoolean){
    setTimeout(() => {
      console.log("teste")
      this.loadShow=!this.loadShow;
      this.show = !valorBoolean;
    }, 1000)
  },
  filtroEfeitoModal(){
    this.loadShow=!this.loadShow;
    this.efeitoModal(this.show)
    
  },
  erroProcura(){
    this.erroModal=!this.erroModal;
    this.show=!this.show;
    
  },
  //Zera o modal para próxima renderização
  zeraModal(){
    $(".tipo").remove();
    $(".status").remove();
    
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
  }
    
  },
  mounted(){
    this.eventScroll();
    
  }
  
}
</script>


<style lang="scss" scoped>
 


.titulo{
    font-size: 50px;
    color: #ffdd21;
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
        transform: scale(.6);
        color: #05050580;
        background-color: white;
        font-size: 10px;
        height: inherit;
        width: 10%;
        border:none;
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
            
            z-index: 99!important;
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
            /* &:focus, &:active{
              .modalDetalhes{
                transform: scaleY(1)!important;
              }
            } */
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
          transform: scale(.5);
        }

      }
      .avatar{
        width: 96px;
        background-color: transparent;
        
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
          width: 80%;
          justify-content: space-evenly;
          span{
            margin:5px;
            text-transform: capitalize;
            background-color: #c8c1c1;
            border-radius: 10px;
            width: 90px;
            height: 24px;
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
