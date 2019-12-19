<template>
  <div :class="{efeito: valida}" v-show="show" class="iniciando">
    <div  class="box-load">
        <div class="image"></div>
        <div class="load">
            Loading 
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            valida:false,
            show:true
        }
    },
    methods:{
        efeitoLoad(){
            setTimeout(()=> {this.valida = true}, 5000)
            setTimeout(()=> {this.show = false}, 6000)
        }
    },
    mounted(){
        this.efeitoLoad()
    }
}
</script>

<style lang="scss" scoped>
    .efeito{
        opacity: 0;
        z-index: -999!important;
        transition: all 1s ease-in-out
    }
    .iniciando{
        position: absolute;
        top: -16px;
        right: 0;
        left: 0;
        bottom: -118px;
        z-index: 9;
        background-color: rgba(0, 0, 0);
        display: flex;
        justify-content: center;
        align-items: center;
        
        .box-load{
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 140px;
            width: 345px;
            .image{
                position: absolute;
                top:0;
                left: -25px;
                background-image: url("../../static/Pichu.png");
                background-repeat: no-repeat;
                background-size: 50%;
                background-position: 57% 5%;
                height: 140px;
                width: 200px;
                animation: animacao 2s linear;
                animation-iteration-count: infinite;
            }
            .load{
                color:white;
                font-weight: bold;
                font-size: 31px;
                margin-left: 4rem;
                span{
                    /* background-color:#fef244; */
                    border-radius: 50%;
                    height: 9px;
                    width: 9px;
                    margin: 13px 9px 0px 3px;
                    line-height: 0;
                    display: inline-table;
                    margin-top: 18px;
                    
                    
                }
                span:nth-child(1){
                    animation: dotLoad 1.5s .5s ease-in;
                    animation-iteration-count: infinite;
                }
                span:nth-child(2){
                    animation: dotLoad 1.5s .8s ease-in;
                    animation-iteration-count: infinite;
                }
                span:nth-child(3){
                    animation: dotLoad 1.5s 1.1s ease-in;
                    animation-iteration-count: infinite;
                }
                @keyframes dotLoad {
                    0%{ 
                        background-color: white;
                        transform: translateY(10%);
                    }
                    50%{
                        background-color: yellow;
                        transform: translateY(-50%)
                    }
                   
                    
                    100%{
                        background-color: white;
                        transform: translateY(10%)
                    }
                }

            }
            
        @keyframes animacao {
                
            0% {
                /* transform-origin: 50% -5%;
                */transform: rotate(-5deg) translateY(0%);
            }
            
            50% {
                transform: rotate(5deg) translateY(0%);
            }
            100% {
                transform: rotate(-5deg) translateY(0%);
            }  
        }        
        
    }

}
</style>