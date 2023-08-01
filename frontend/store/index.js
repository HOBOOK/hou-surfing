import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex)

//엄격모드 비활성화
export const strict = false

const store = () => new Vuex.Store({
  state:{
    theme:'system',
    locale:'ko',
    miniNav:false,
  },
  mutations:{
    
    setTheme: (state, theme) => {
      state.theme = theme
    },
    setLocale: (state, locale) => {
      state.locale = locale
    },
    setMiniNav: (state, miniNav) => {
      state.miniNav = miniNav
    },
    
  },
  actions:{

  },
  getters: {
  }
})

export default store