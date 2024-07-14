import colors from 'vuetify/es5/util/colors'
import i18nConfig from "./i18n/config";
import locales from "./i18n/locales";
import webpack from 'webpack'



export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  mode: 'spa',
  ssr: false,
  target: 'static', // 정적 웹사이트임을 명시
  router: {
    base: '/HOBOOK/' // github repository 이름 넣기
  },
  head: {
    script: [
      // { src: 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js' },
      // { src: 'https://docs.opencv.org/3.4/opencv.js' },
    ],
    titleTemplate: 'Gyeongho Park - %s',
    title: 'Gyeongho Park',
    htmlAttrs: {
      lang: 'ko'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:title', property: 'og:title', content: 'Gyeongho Park' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Gyeongho Park' },
      { hid: 'description', name: 'description', content: 'Gyeongho Park' },
      { hid: 'og:image', property: 'og:image', content: 'https://d2q9yzkd471o7j.cloudfront.net/logo/head_logo.png?w=300&h=300' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/earlyaccess/nanumgothic.css'},
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css'},
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css'},
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://unpkg.com/@highlightjs/cdn-assets@11.5.0/styles/tomorrow-night-blue.min.css",
      },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.css'}
    ]
  },

  //loading: '~/components/Loading.vue',
  loading:false,


  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~/assets/scss/common.scss",
    "~/assets/scss/transition.scss"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/router.js', mode: 'client' },
    '~/plugins/axios.js',
    {src:'~/plugins/vuex-persis.js', ssr:false},
    '~/plugins/component.js',
    '~/plugins/global.js',
    '~/plugins/vue-snotify.js',
    {src: '~/plugins/particle.js', ssr: false},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
    '@nuxtjs/svg',
    '@nuxt/components'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // '@nuxtjs/auth',ㅈ
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-route-meta',
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
    'nuxt-healthcheck',
    'nuxt-i18n',
  ],

  i18n:{
    seo: true,
    locales,
    defaultLocale: 'ko',
    vueI18n: i18nConfig,
    skipSettingLocaleOnNavigate: true,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: {
      font: {
        family: 'Pretendard-Regular'
      },
    },
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken1,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light:{
          primary: colors.blue.darken1,
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['axios'],
    hotMiddleware:{
      client:{
        quiet:true
      }
    },
    html: {
      minify: {
        collapseWhitespace: true,  // as @dario30186 mentioned
        removeComments: true, // 👈 add this line
      },
    },
    // babel: {
    //   plugins: [['transform-remove-console',{"exclude" : ["debug"]}]]
    // }
    plugins: [
      new webpack.ProvidePlugin({
        // global modules
        $: 'jquery',
        jQuery: 'jquery',
        IScroll: 'iscroll',
        // _: 'lodash'
      })
    ],
    transpile: [
      "three"
    ],
    extend (config, ctx) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.txt$/,
        loader: 'raw-loader',
        exclude: /(node_modules)/
      });
    }
  },

  axios:{
    baseURL: 'http://localhost:5000', // 개발 서버
    //baseURL: 'http://vridge-elb-1347548385.ap-northeast-2.elb.amazonaws.com/api' // 프로덕트 서버
    //credentials: true,
    //retry: false,
  },

  healthCheck: {
    contentType: 'application/json',
    healthy: () => {
      return JSON.stringify({result: 'ok'})
    }
  },

  // auth:{
  //   //localStorage: false,
  //   watchLoggedIn: true,
  //   // plugins:[
  //   //   '~/middleware/auth.js'
  //   // ],
  //   strategies:{
  //     redirect: {
  //       login: '/auth/login',
  //       logout: '/auth/login',
  //       callback: false,
  //       home: false
  //     },
  //     local: {
  //       scheme: 'refresh',
  //       token: {
  //         maxAge: 1800,
  //         global: true,
  //         required: false,
  //         property: 'token',
  //       },
  //       refreshToken: {
  //         maxAge: 60 * 60 * 24 * 7,
  //         property: 'refreshToken',
  //         data: 'refreshToken',
  //         grantType: 'refreshToken'
  //       },
  //       autoFetch:false,
  //       user:{
  //         property: 'user',
  //         autoFetch:false
  //       },
  //       endpoints: {
  //         login: { url: 'auth/login', method: 'post',propertyName: 'token' },
  //         user: { url: 'auth/user', method: 'get', propertyName:false },
  //         refresh: { url: 'auth/refresh', method: 'post', propertyName: 'refreshToken'},
  //         logout:false,
  //       },
  //       //tokenType:'',
  //       tokenRequired: true,
  //       cookie: {
  //         prefix: "auth.",
  //         options: {
  //           path: "/",
  //         }
  //       },
  //       localStorage: {
  //         prefix: "auth."
  //       },
  //     },
  //     google:{
  //       _scheme: 'oauth2',
  //       scope: ['openid', 'profile', 'email'],
  //       response_type: 'token',
  //       client_id: '877979614075-2d38epanvv8rc6cctkj7fu7jshavihag.apps.googleusercontent.com'
  //     }
  //   },
  // },

  generate: {
    minify: {
      collapseWhitespace: false
    }
  }

  /*
  serverMiddleware: [
    // body-parser middleware
    bodyParser.json(),
    // session middleware
    session({
      secret: 'super-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }
    }),
    // Api middleware
    // We add /api/login & /api/logout routes
    '~/apis'
  ],

  server:{
    port:process.env.PORT || 8000
  }
  */
  ,
  server:{
    host: '0.0.0.0'
  }
}


