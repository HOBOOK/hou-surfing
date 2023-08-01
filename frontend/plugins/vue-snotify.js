import Vue from 'vue';
import Snotify, { SnotifyPosition } from 'vue-snotify'
import 'vue-snotify/styles/dark.css'; // or dark.css or simple.css, material

const options = {
  global: {
    pauseOnHover: true,
    newOnTop: false,
    oneAtTime: true,
    //titleMaxLength: 110,
    //bodyMaxLength: 1110,
  },
  toast: {
    position: SnotifyPosition.centerTop,
    timeout: 2000,
    showProgressBar: false,
    preventDuplicates: true,
  }
}

Vue.use(Snotify, options)