import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@fortawesome/fontawesome-free/css/all.css' 

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'faSvg',
  },
  customProps: {
    
    VTooltip: {
      transition: "", // 기본 v-tooltip 전환을 fade-transition로 설정
    },
  },
});