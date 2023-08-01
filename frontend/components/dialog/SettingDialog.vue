<template>
  
  <div>
    <Dialog
      line-theme
      :width="1200"
      :height="720"
      v-model="dialog"
      ref="settingDialog"
    >
      <template v-slot:title>
        <v-icon left dense>mdi-cog-outline</v-icon>
        {{ $t('settings') }}
        <v-spacer/>

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-text-field
              v-on="on"
              v-model="keyword"
              prepend-inner-icon="mdi-magnify"
              dense
              solo
              hide-details
              :placeholder="$t('search_hint')"
              style="max-width:320px;"
              :max-length="50"
              @keydown.enter.prevent="onEnterSerch()"
            ></v-text-field>
          </template>

          <v-list v-if="searchedList.length > 0">
            <v-list-item
              v-for="(item, index) in searchedList"
              :key="'searched-' + index"
              @click="onClickItem(item), keyword = ''"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        
        
      </template>
      <template v-slot:button="{on, attrs}">
          <div v-on="on" v-bind="attrs">
              <slot name="activator"></slot>
          </div>
      </template>

      <template v-slot:content>
        <v-row no-gutters style="height:100%;" :key="settingKey">
          <v-col cols="3">
            <folder-tree :folders="settings" @click:item="onClickItem" :highlight="selectedSetting?.id"/>
          </v-col>
          <v-divider vertical/>
          <v-col cols="9">
            <v-card v-if="selectedSetting" flat color="transparent">
              <v-card-title>
                {{ $t('setting_' + selectedSetting.id) }}

                <span class="text-caption ml-2 grey--text">
                  {{ $t('setting_' + selectedSetting.id + '_description') }}
                </span>
              </v-card-title>
              

              <v-divider/>

              <div v-if="selectedSetting?.type === 'root'">
                <v-card-title>
                  {{ $t('list') }}
                </v-card-title>
                <folder-tree  :folders="selectedSetting.subFolders" @click:item="onClickItem"/>
              </div>


              <v-list v-else color="transparent" class="ma-0 pa-0">
                <v-list-item
                  v-for="item in selectedSetting.settingItems"
                  :key="item.name"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('setting_' + item.name) }}
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-select
                      v-if="item.type === 'select'"
                      :items="item.items"
                      @input="item.input"
                      dense
                      style="max-width:180px;"
                      v-model="item.model"
                      hide-details
                    >
                      <template v-slot:selection="{item}">
                        {{ $t('setting_' + item) }}
                      </template>
                      <template v-slot:item="{item}">
                        {{ $t('setting_' + item) }}
                      </template>
                    </v-select>
                  </v-list-item-action>
                </v-list-item>

                <empty v-if="selectedSetting.settingItems?.length === 0" icon="mdi-cog-off-outline" :subtext="$t('setting_no_message')"/>
                
              </v-list>
            </v-card>
            
          </v-col>
        </v-row>
      </template>

    </Dialog>

  </div>
</template>

<script>
import Dialog from './Dialog.vue'

export default {
  components:{
    Dialog
  },
  props:{
    dialogActive: Boolean
  },  
  data() { return {
    dialog:false, 
    selectedSetting:null,
    settings:[],
    settingKey:0,
    settingIndex:{},
    keyword:'',
    searchedList:[]
    
  }},
  computed:{
  },
  
  methods:{
    init(){
      this.$nextTick(() => {
        this.settings = [
          {
            id: 'general',
            name: this.$t('setting_general'),
            description: this.$t('setting_general_description'),
            type:'root',
            subFolders:[{
              id:'theme',
              name: this.$t('setting_theme'),
              description: this.$t('setting_theme_description'),
              settingItems:[{
                name:'theme',
                type:'select',
                items:['light', 'dark', 'system'],
                model: this.$store.state.theme,
                input: this.setTheme 
              }]
            },{
              id:'localization',
              name: this.$t('setting_localization'),
              description: this.$t('setting_localization_description'),
              settingItems:[{
                name:'localization',
                type:'select',
                items:['ko', 'en'],
                model: this.$store.state.locale,
                input: this.setLocale 
              }]
            }]
          },

          {
            id: 'integration',
            name: this.$t('setting_integration'),
            description: this.$t('setting_integration_description'),
            type:'root',
            subFolders:[{
              id:'integration_vridge_ai',
              name: this.$t('setting_integration_vridge_ai'),
              description: this.$t('setting_integration_vridge_ai_description'),
              settingItems:[]
            },{
              id:'integration_notification',
              name: this.$t('setting_integration_notification'),
              description: this.$t('setting_integration_notification_description'),
              settingItems:[]
            }]
          }
        ]

        this.generateSettingIndex(this.settings)
        this.settingKey++
      })

    },

    generateSettingIndex(settings){
      this.settingIndex = {}
      for(let i = 0; i < settings.length; i++) {
        for(let j = 0; j < settings[i].subFolders.length; j++) {
          let settingMenu = settings[i].subFolders[j]
          this.settingIndex[settingMenu.name] = settingMenu
        }
      }
    },

    onEnterSerch(){
      if(this.searchedList.length > 0) {
        this.onClickItem(this.searchedList[0])
        this.keyword = ''
      }
    },

    onClickItem(item){
      this.selectedSetting = item
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

    setLocale(locale) {
      if(this.$i18n.locale) {
        this.$store.commit('setLocale', locale)
        this.$i18n.locale = this.$store.state.locale

        this.init()
      }

    },

    activeDialog() {
      this.$refs.settingDialog.dialog = true
    }
    
  },
  mounted(){
    this.init()
  },
  watch:{
    dialog(){
      if(this.dialog) {
        this.init()
      }
    },
    keyword(){
      this.searchedList = []
      if(this.keyword) {
        for(let key of Object.keys(this.settingIndex)) {
          if(key.toLowerCase().includes(this.keyword.toLowerCase())){
            this.searchedList.push(this.settingIndex[key])
          }
        }
      }
    },
  }
}
</script>

<style lang="scss">


</style>