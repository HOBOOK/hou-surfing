<template>
  <v-app class="default-layout-container">
    <v-app-bar
      app
      fixed
      flat
      clipped-left
      shrink-on-scroll
      color="transparent"
    >
      <v-container fill-height>
        <v-row no-gutters align="center">
          <v-col cols="4">
            <v-row no-gutters align="center">
              <div class="logo-cover" @click="$router.push('/')">
                <v-img src="/logo.png" contain width="48" height="48"/>
                <span>
                  Gyeongho
                </span>
              </div>
            </v-row>
          </v-col>
          <v-col cols="4">
            
            <v-row no-gutters align="center" justify="center">
              <div class="menu-cover">
                <a
                  v-for="(item, idx) in menus"
                  :key="'menu-' + idx"
                  @click="$router.push(item.router)"
                >
                  {{ $t(item.title) }}

              </a>
              </div>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row no-gutters align="center" justify="end">
              <span class="text-subtitle-2">
                {{ $i18n.locale }}
              </span>
              <header-item icon="mdi-web" @click="setLocale($i18n.locale === 'ko' ? 'en' : 'ko')" class="mr-3"/>

              <header-item :icon="!$vuetify?.theme.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'" class="mr-3" @click="toggleTheme()"/>
              <header-item icon="mdi-github" @click="$utils.openPage('https://github.com/HOBOOK')"/>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <Loading v-if="loadingInit"/>

    <v-main v-else>
      <v-container>
          <vue-snotify></vue-snotify>
          <Nuxt />
      </v-container>
    </v-main>
  </v-app>

</template>

<script>
import lightTheme from '~/assets/scss/lightTheme.scss'
import darkTheme from '~/assets/scss/darkTheme.scss'
import SettingDialog from '~/components/dialog/SettingDialog.vue'

export default{
  head () {
    return {
      titleTemplate(title) {
        return `${title} | ${this.$route.meta.title || ''}`
      }
    }
  },
  components: {
    SettingDialog
  },

  beforeMount() {
    if (process.client && !window.routeChanged) {
      window.routeChanged = true;
      this.loadingInit = true;
      setTimeout(() => (this.loadingInit = false), 3000); // 설정한 duration 값으로 수정하세요.
    }
  },

  data:() => ({
    loadingInit:false, 
    drawer: null, 
    notifications:[],
    menus: [
      {title: 'home', router:'/', icon:'mdi-home-roof'},
      {title: 'project', router:'/project', icon:'mdi-view-dashboard'},
      {title: 'blog', router:'/blog', icon:'mdi-view-dashboard'},
      {title: 'courses', router:'/courses', icon:'mdi-view-dashboard'},
    ]
  }),
  computed:{
    isExpandNav() {
      return this.$store.state.miniNav && this.checkViewLarge()
    }
  },
  methods:{
    setTheme(theme) {
      if(this.$vuetify.theme) {
        this.$store.commit('setTheme', theme)

        let darkMode = false

        if(theme === 'system') {
          darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        } else {
          darkMode = theme === 'dark'
        }

        this.$vuetify.theme.dark = darkMode
      }
    },

    toggleTheme() {
        if(this.$vuetify.theme.dark) {
          this.setTheme('light')
        } else {
          this.setTheme('dark')
        }
      },

    setLocale(locale) {
      if(this.$i18n.locale) {
        this.$store.commit('setLocale', locale)
        this.$i18n.locale = this.$store.state.locale
      }
    },

    logout(){
      this.$auth.logout()
      this.$router.push('/auth/login')
    },



    
    isMenuActive(menuPath) {
      const path = decodeURI(this.$route.path)
      if(menuPath === '/') {
        if(path === '/')
          return true
        else
          return false
      }
      if(path.indexOf(menuPath) !== -1) 
        return true
      else
        return false
    },


    checkViewLarge() {
      if(['md','sm','xs'].indexOf(this.$vuetify.breakpoint.name) !== -1) {
        return false
      } else {
        return true
      }
    },
  },

  mounted(){
    if (process.client && window.routeChanged) {
      window.routeChanged = false;
    }

    this.setTheme(this.$store.state.theme)
    this.setLocale(this.$store.state.locale)
  },
  watch:{
    async '$route'(to, from){
      window.scrollTo(0, 0)
    },

    
    '$store.state.settingDialog'(){
      this.$refs.settingDialog.activeDialog()
    }
  },

}

</script>

<style lang="scss">
.default-layout-container {
  overflow-x: hidden;
  overflow-y: hidden;

  .v-app-bar {
    transition-property: transform, left, right, box-shadow, max-width, width;
    min-width: 320px;

    .logo-cover{
      display: flex;
      flex-direction: row;
      align-items: center;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
      font-size: 1.1rem;
      font-family: "Pretendard-ExtraBold", sans-serif !important;
      cursor: pointer;
      &:hover{
        opacity: 0.8;
      }
    }

    .menu-cover{
      font-size: 1rem;
      a {
        color: currentColor !important;
        margin:0 16px !important;
        &:hover{
          opacity: 0.8;
        }
      }

    }
  }
}

</style>