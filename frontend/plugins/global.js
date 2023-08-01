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

    convertByteNumber(bytes, decimals = 2) {
      if (bytes === 0) return '0';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    },

    convertByteSize(bytes) {
      if (bytes === 0) return 'Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return sizes[i];
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

    // 이미지파일과 어노테이션 파일을 Zip으로 압축해서 다운받는 함수
    // async downloadDatasetZip(files, name){
    //     let zip = new JSZip()

    //     return new Promise((resolve, reject) => {
    //         for (let i = 0; i < files.length; i++) {
    //             let filename = files[i].filename
    //             let folder = files[i].folder
    //             zip.file(folder+"/"+filename, files[i].image,{ base64: true, createFolders: true })
    //             filename = filename.substring(0,filename.indexOf("."))
    //             zip.file(folder+"/"+filename + '.xml', atob(files[i].annotation))
    //         }
    //         zip.generateAsync({
    //             type: "blob"
    //         }).then((content) => {
    //             FileSaver.saveAs(content, name + "_dataset_" + Date.now() + ".zip")
    //             resolve()
    //         })
    //     })
    // },

    async downloadDatasetZip(dataset){
      return new Promise((resolve, reject) => {
        let decodedZip = atob(dataset.zipBytes)
        let byteNumbers = new Array(decodedZip.length)

        for ( let i = 0; i < decodedZip.length; i++) {
          byteNumbers[i] = decodedZip.charCodeAt(i)
        }

        let blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/zip' });
        FileSaver.saveAs(blob, dataset.id + '.zip');
        resolve()
      })
    },
    

    async downloadSourceData(files, annotationFiles, name, datasetInfo){
      let zip = new JSZip()

      return new Promise((resolve, reject) => {
        for (let file of files) {
          let filename = file.filename
          let folder = file.folder +"/"
          let annotation = file.annotation

          zip.file("image/"+folder+ filename, file.image,{ base64: true, createFolders: true })
          filename = filename.substring(0,filename.indexOf("."))

          if(datasetInfo.isSingleFormat && datasetInfo.type !== 'IMAGE_ONLY' && annotation) {
            zip.file('annotation/' + folder + filename + datasetInfo.extension, this.decodefile(annotation))
          }
        }

        if(!datasetInfo.isSingleFormat && annotationFiles) {
          for(let file2 of annotationFiles) {
            let annotationFolder = file2.folder
            let annotation = file2.annotation

            zip.file('annotation/' + annotationFolder + datasetInfo.extension, this.decodefile(annotation));
            
          }
        }

        zip.generateAsync({
            type: "blob"
        }).then((content) => {
            FileSaver.saveAs(content, name + "_dataset_" + Date.now() + ".zip")
            resolve()
        })
      })
    },

    padZero(num, digits) {
      let zero = '0';
      return String(num).padStart(digits, zero);
    },

    decodefile(file) {
      return decodeURIComponent(escape(atob(file)))
    },

    getSizeOfImageFile(file) {
      return new Promise((resolve, reject)=> {
        let img= new Image();
        let src = URL.createObjectURL(file);
        let size = {
          width:0,
          height:0
        }
        img.src = src
        img.onload = function () {
          size.width = this.width
          size.height = this.height
          resolve(size)
        };
        img.onerror = reject
      })
    },

    getSizeOfImageSrc(src) {
      return new Promise((resolve, reject)=> {
        let img= new Image();
        let size = {
          width:0,
          height:0
        }
        img.src = src
        img.onload = function () {
          size.width = this.width
          size.height = this.height
          resolve(size)
        };
        img.onerror = () => {
          reject(size)
        }
      })
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

    isNumeric(num, opt){
      // 좌우 trim(공백제거)을 해준다.
      num = String(num).replace(/^\s+|\s+$/g, "");
     
      if(typeof opt == "undefined" || opt == "1"){
        // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
        var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
      }else if(opt == "2"){
        // 부호 미사용, 자릿수구분기호 선택, 소수점 선택
        var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
      }else if(opt == "3"){
        // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
        var regex = /^[0-9]+(\.[0-9]+)?$/g;
      }else{
        // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
        var regex = /^[0-9]$/g;
      }
     
      if( regex.test(num) ){
        num = num.replace(/,/g, "");
        return isNaN(num) ? false : true;
      }else{ return false;  }
    },

    isPrivateIp(ip) {
      if(ip) {
        const parts = ip.split('.');
        const firstPart = parseInt(parts[0], 10);

        if (firstPart === 10 || (firstPart === 192 && parseInt(parts[1], 10) === 168) || (firstPart === 172 && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31))) {
            return true;
        }
      }
      return false;
    },

    formatCardNumber(cardNumber) {
      return cardNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
    },

    getIpAddress(url) {
        const match = url.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        return match ? match[0] : null;
    },

    getDomainName (url) {
        const match = url.match(/:\/\/(www[0-9]?|[a-zA-Z]\w*)\./);
        const startIndex = match.index + match[0].length - 1;
        const endIndex = startIndex + match[1].length;

        return url.slice(startIndex, endIndex);
    },

    generateUUID() {
      return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

}

const regular = {
  basic(data){
    let reg=/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    return reg.test(data)
  },
  noBlank(data){ // 공백 없을 경우 true 반환
    let reg = /[\s]/g;
    return !reg.test(data)
  },
  passwordPatten(data){
    //영문,숫자,특수문자(!@$%^&* 만 허용) 9 이상
    let reg= /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{9,20}$/g
    return reg.test(data)
  },
  emailPatten(data){
    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(data)
  },
  name(data){
    let reg =  /^[ㄱ-ㅎ가-힣a-zA-Z\s]+$/
    return reg.test(data)
  },
  projName(data){ // 한글,영문,숫자,공백만 입력되었는지 TEST
    let reg =  /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]+$/
    return reg.test(data)
  },
  projDescription(data){ // 한글,영문,숫자,공백,특수문자, 이모지 입력되었는지 TEST
    let reg =  /^[\s\p{L}\p{N}\p{P}\p{S}\p{Emoji_Presentation}]+$/u;
    return reg.test(data)
  },
  number(data){
    let reg = /^[0-9]/
    return reg.test(data)
  },
  phone(data) {
    let reg = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
    return reg.test(data)
  },
  postalCode(data) {
    let reg = /^[0-9]{5}$/
    return reg.test(data)
  }
}



Vue.prototype.$utils = utils;
Vue.prototype.$regular = regular;


export default ({app}, inject) => {
  inject('utils', utils);
  inject('regular', regular);
}
