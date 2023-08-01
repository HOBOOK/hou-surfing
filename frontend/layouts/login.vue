<template>
  <v-app class="default-layout-container">
      <v-app-bar
        app
        flat
        clipped-left
        color="transparent"
      >

          <v-row no-gutters align="center">
            <v-btn text plain @click="$router.push('/')" class="mx-0 px-0">
              <v-img src="/logo/s01.png" :max-height="36" :max-width="36" contain/>
              <strong class="system-title">{{ $t('rms') }}</strong>

              <span class="opacity-7">Robot Management System</span>
            </v-btn>

            <v-spacer/>
            <header-item icon="mdi-theme-light-dark" class="mr-3" @click="toggleTheme()"/>

            <header-item icon="mdi-web" class="mr-3">
              <template v-slot:content>
                <v-list :width="160">
                  <v-list-item  @click="setLocale('ko')">
                    한글
                  </v-list-item>
                  <v-divider/>
                  <v-list-item @click="setLocale('en')">
                    English
                  </v-list-item>
                </v-list>
              </template>
            </header-item>
          </v-row>

      </v-app-bar>
      
      <v-main>
          <Nuxt />
          <client-only>
            <vue-snotify></vue-snotify>
          </client-only>

      </v-main>

  </v-app>
  </template>
  <script>
  import lightTheme from '~/assets/scss/lightTheme.scss'
  import darkTheme from '~/assets/scss/darkTheme.scss'

  export default {
    head () {
      return {
        titleTemplate(title) {
          return `${title} | ${this.$route.meta.title || ''}`
        }
      }
    },
    mounted(){
      this.$vuetify.theme.dark = false

      this.setTheme(this.$store.state.theme)
      this.setLocale(this.$store.state.locale)
    },
    methods:{
      setLocale(locale) {
        if(this.$i18n.locale) {
          this.$store.commit('setLocale', locale)
          this.$i18n.locale = this.$store.state.locale
        }
      },

      
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
      }
    }
  }
  </script>
  