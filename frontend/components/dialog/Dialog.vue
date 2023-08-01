<template>
  <v-dialog
    v-model="dialog"
    :persistent="persistent"
    scrollable
    :max-width="maxWidth"
    :max-height="maxHeight"
    :width="width"
    :fullscreen="fullDialog"
    @keydown.enter="enterKeyEvent"
    content-class="vridge-dialog-container"
    @input="$emit('input', dialog)"
  >
    <template v-slot:activator="{on, attrs}">
      <slot name="button" v-on="on" v-bind="{on, attrs}"></slot>
    </template>
    
    <v-card class="vridge-dialog" :class="[lineTheme ? 'line-theme' : '', noGutters? 'no-gutters': '']" :tile="tile" elevation="0" :max-height="maxHeight" :min-height="height">
      <v-card-title class="vridge-dialog-title">
        <slot name="title" v-if="$slots.title"> 

        </slot>
        <v-row v-else no-gutters align="center">
          <span class="font-weight-bold">
            {{title}}
          </span>
          <v-spacer/>
          <v-avatar size="28" class="vridge-dialog-close" v-if="closeButton">
            <v-icon class="font-weight-bold" @click="clickNo" >mdi-close</v-icon>
          </v-avatar>
        </v-row>
      </v-card-title>


      <v-card-text class="vridge-content-container" :style="'overflow-y:' + overflow + ';background:' + background">
        <slot name="content">
        </slot>
      </v-card-text>
      <v-card-actions class="vridge_actions" v-if="!$slots.actionButton" >
        <v-row no-gutters align="center">
          <v-spacer/>
            <v-btn
              elevation="0"
              @click="clickNo"
              :disabled="disabledNo"
              :loading="loading"
              text
            >
              <span>{{$t('close')}}</span>
            </v-btn>

            <v-btn
              v-if="clickYesBtn"
              color="primary"
              @click="clickYes"
              elevation="0"
              :loading="loading"
              :disabled="disabledYes"
              class="ml-2"
            >
              <span>{{clickYesBtn}}</span>
            </v-btn>
        </v-row>
        
        
        
      </v-card-actions>
      <v-card-actions v-else class="vridge_actions">
        <slot name="actionButton"> </slot>
      </v-card-actions>
      
      
    </v-card>
  </v-dialog>
</template>

<script>

  export default {
    name: 'Dialog',
    props: {
      persistent:{
        type:Boolean,
        default:false
      },
      borderBottom:{
        type:Number
      },
      borderRadius:{
        type:Number
      },
      color:{
        type:String
      },
      colorHeader:{
        type:String
      },
      fullscreen:{
        type:Boolean,
        default:false
      },
      disabled:{
        type: Boolean,
        default: false
      },
      icon:{
        type: String,
        default: ''
      },
      title:{
        type: String,
        default: '새창'
      },
      width:{
        type: Number,
        default: 500
      },
      height:{
        type: Number,
        default: 120
      },
      maxWidth:{
        type: Number,
        default: 1080
      },
      maxHeight:{
        type: Number,
        default: 900
      },
      padding:{
        type:String
      },
      overflow:{
        type:String,
        default:'auto'
      },
      background:{
        type:String
      },
      backgroundHeader:{
        type:String
      },
      clickYesBtn:{
        type:String,
        default:""
      },
      mobileFull:{
        type:Boolean,
        default:false
      },
      enterKeyActive:{
        type:Boolean,
        default:false
      },
      tile:{
        type:Boolean,
        default:false
      },
      closeButton:{
        type:Boolean,
        default:false
      },
      loading: {
        type:Boolean,
        default:false
      },
      disabledYes: {
        type:Boolean,
        default:false
      },
      disabledNo: {
        type:Boolean,
        default:false
      },
      autoClose: {
        type:Boolean,
        default:true
      },
      lineTheme:{
        type:Boolean,
        default:false
      },
      noGutters:{
        type:Boolean,
        default:false
      }
    },
    data: () => ({
      dialog: false,
      format:'YYYY-MM-DD',
      isFullDialog:false
    }),
    watch:{
      dialog() {
        this.$emit('change')
        if(this.dialog) {
          this.init()
          if(this.mobileFull){
            this.isFullDialog = window.innerWidth <= 768
          }
          
        } else {
          this.$emit('click-no')
          this.$emit('close')
        }
          
      },
    
    },
    computed: {
      fullDialog(){
        return this.isFullDialog || this.fullscreen
      }
    },
    methods:{
      init(){
      },
      clickYes(){
        if(this.autoClose) this.dialog = false
        this.$emit('click-yes')
      },
      enterKeyEvent(){
        if(this.enterKeyActive){
          this.clickYes()
        }
      },
      select (index) {
        this.selectedIndex = index
      },
      clickNo(){
        this.dialog = false
        this.$emit('click-no')
      },
      resizeEventHandler(e) {
        if(this.dialog && this.mobileFull) {
          if(e.currentTarget.outerWidth <= 768) {
            this.isFullDialog = true
          } else {
            this.isFullDialog = false
          }
        } else {
          this.isFullDialog = false
        }
        
      },

    },
     mounted(){
      window.addEventListener("resize", this.resizeEventHandler);
    },
    destroyed() {
      window.removeEventListener("resize", this.resizeEventHandler);
    },
  }
</script>
<style lang="scss">

.vridge-dialog-container{  

  transition: transform .2s ease-in-out opacity .2s ease-in-out !important;
  *{
    transition: transform .2s ease-in-out opacity .2s ease-in-out !important;
  }

  .theme--light &{
    box-shadow: 0px 10px 24px #08132f20 !important;

    .vridge-dialog{
      //border:1px solid #fafbfc !important;
    }
  }

  .theme--dark &{
    box-shadow: 0px 10px 24px #08132f20 !important;

    .vridge-dialog{
      //border:1px solid #32343880 !important;
    }
  }
  
}
  .vridge-dialog{
    overflow-x:hidden;
    
    > .v-card__title{
      font-size:1.2rem !important;
      padding:12px !important;
      
    }

    .vridge-dialog-title{
      position: relative;
    }
    

    .vridge-content-container{
      padding:0px 12px !important;
      overflow-x: hidden;
      font-size: 14px;
    }

    .vridge_actions{
      padding: 12px !important;
      position: relative;
    }

    &.line-theme{
      padding:0px;
      > .v-card__title{
        padding:12px !important;
      }

      .vridge-content-container{
        border-top:1px solid $default-border-color;
        padding:0px !important;
        border-bottom:1px solid $default-border-color;

      }

      .vridge_actions{
        padding: 12px !important;
      }
    }

    &.no-gutters{
      .vridge-content-container{
        padding:2px 0px !important;
      }
    }

    
  }
  .create-slot-cover{
    padding:0;
    margin:0;
    .search-menu-cover{
      display:flex;
      background-color:transparent;
      border:1px solid #e0e0e0;
      border-radius: 5px;
    }
    .search-menu-check-cover{
      .v-input--selection-controls {
        padding: 0;
        margin: 0;
      }
      .v-messages {
        display:none !important;
      }
    }
  }
  
  .v-dialog--persistent{
    .vdp-datepicker, .vdpWithInput{
      height:38px;
      width:100%;
      input{
        height: 38px;
        padding-left:12px;
        width:100%;
        font-size:15px;
      }
      .vdp-datepicker__calendar{
        bottom: 40px;
      }
    }
  }

  .vdpClearInput{
    display:none !important;
  }

  .dateInput >>> input{
      padding:8px 0px;
      font-size: 13px;
      font-weight: 500;
      opacity: .7;
    }

    .dateInput >>> button::before{
      display:none !important;
    }

    .calendarCustom{
      font-size:20px;
      margin-left:-25px;
      position:relative;
      color:#4159b2;
      cursor:pointer;
      display:flex;
      align-items:center;
    }

/* .v-dialog{
  overflow-y: initial;
}*/
  .search-menu-cover{
      .vdpHeader{
        background:rgba(0,0,0,0.05) !important;
    }
  }

  .vridge-dialog-close{
    transition: all 0.2s ease-in-out;
    opacity: 0.7;

    &:hover{
      transform:scale(1.1) !important;
      opacity: 1.0;
        .theme--dark{
          background-color:#1b1c20 !important;
        }
        .theme--light{
          background-color:#ccc !important;
        }
        font-weight: bold !important;
      }
  }
</style>