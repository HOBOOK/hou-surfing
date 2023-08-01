import Vue from 'vue'

const utils = {
    // 소수점2자리까지의 바이트 단위로 변환시키는 함수
    convertByteToString(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }, 

    checkViewMode(level, vuetify) {
      let viewMode = ['xs', 'sm', 'md', 'lg', 'xl']
      if(viewMode.slice(0,level).indexOf(vuetify.breakpoint.name) !== -1) {
        return false
      } else {
        return true
      }
    },

    btoa(content) {
      try{
        return window.btoa(content)
      }catch{
        this.btoaEscape(content)
      }
    },

    btoaEscape(content) {
      return window.btoa(encodeURIComponent(content).replace(/%([0-9A-F]{2})/g,function(match,p1){return String.fromCharCode('0x'+p1)}))
    },

    padZero(num, digits) {
      let zero = '0';
      return String(num).padStart(digits, zero);
    },

    decodefile(file) {
      return decodeURIComponent(escape(atob(file)))
    },

    // 클립보드 저장 함수
    copy(val, callback = null) {
      if(val) {
        if(navigator.clipboard) {
            navigator.clipboard.writeText(val).then(() => {
              
            })
        } else {
          const t = document.createElement("textarea");
          document.body.appendChild(t);
          t.value = val;
          t.select();
  
          document.execCommand('copy');
          document.body.removeChild(t);
        }

        if(callback !== null)
          callback()
      }
    },

    generateUUID() {
      return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

}


Vue.prototype.$utils = utils;
Vue.prototype.$regular = regular;


export default ({app}, inject) => {
  inject('utils', utils);
}
