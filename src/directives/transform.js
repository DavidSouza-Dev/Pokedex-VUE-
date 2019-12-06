import Vue from 'vue'

Vue.directive('transition', {

    bind(el){
        el.addEventListener('dbclick', function(){

            el.style.transtion = 'transform 0.5s';
            el.style.transform = 'scaleY(1)';
        })
    }
});