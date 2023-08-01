<template>
<div class="tab-wrapper ma-0">
  <v-tabs
      v-model="tab"
      :color="color"
      :height="height"
      :slider-size="!button ? sliderSize : 0"
      :fixed-tabs="fixed"
      :centered="centered"
    >
    <v-tab
      
      v-for="(item, index) in items"
      :key="'tab-' + index"
      @change="changeTab(index)"
      :transition="false"
      class="tab"
      :class="button ? 'button' : ''"
      button
      
    >
      <v-row v-if="!button" no-gutters :class="index !== tab ? 'opacity-5' : ''"  :style="'font-size:' + fontSize +'px; '" align="center" justify="center">
        
        <v-icon class="mr-1" v-if="item.icon" :style="'font-size:' + (fontSize+4) + 'px !important;'">{{item.icon}}</v-icon>
        <span style="text-transform:normal !important;">{{ parsingTitle(item.text) }}</span>
        <span v-if="item.append" class="mx-1" style="text-transform:capitalize !important;">{{ item.append }}</span>
      </v-row>
      
      <v-btn class="tab-button" :ripple="false" :height="40" v-else label :elevation="0" :class="index !== tab ? 'opacity-5' : ''" :color="index !== tab ? 'transparent' : ''"   style="cursor:pointer;">
        <v-icon left v-if="item.icon" :style="'font-size:' + (fontSize+4) + 'px !important;'">{{item.icon}}</v-icon>
        <span  style="text-transform:normal !important;">{{ parsingTitle(item.text) }}</span>
        <span v-if="item.append" class="mx-1" style="text-transform:capitalize !important;">{{ item.append }}</span>
      </v-btn>
    </v-tab>
  </v-tabs>

  <v-tabs-items 
    v-model="tab" 
    class="tab-content"
    :class="{append:$slots.append}"
    ref="tabItems"
    v-on:scroll.native="scrollEvent"
    :style="'max-height: calc(100% - ' + (height) + 'px);'"
    :key="'vtis-' + tab"
  >
    <v-tab-item
      v-for="(item, index) in items"
      :key="'tab-' + index"
     >
      <slot :name="item.name ? item.name : item.text" v-bind:item="item">
      </slot>
    </v-tab-item>

  </v-tabs-items>

  <div  class="tab-append" v-if="$slots.append">
    <slot name="append">
    </slot>
  </div>
</div>
</template>

<script>
export default {
  name:'VridgeTab',
  props:{
    items:{
      type: Array,
      default: () => {
        return [{
          name: null,
          text: ''
        }]
      }
    },
    sliderSize:{
      type: Number,
      default:3
    },
    propTabIndex: {
      type:Number,
      default:0
    },
    button:{
      type:Boolean,
      default:false
    },
    fixed:{
      type: Boolean,
      default: true
    },
    centered:{
      type: Boolean,
      default: false
    },
    fontSize:{
      type: Number,
      default: 16
    },
    color:{
      type:String,
      default:'primary'
    },
    height:{
      type:Number,
      default:42
    },
    lowerTabTitle:{
      type:Boolean,
      default:false
    }
  },
  data:()=>({
    tab: 0
  }),
  methods:{
    changeTab(index){
      this.tab = index
      this.$emit('changeTab', this.tab)
    },
    scrollEvent(){
      let scroll = {
        scrollPosition: this.$refs.tabItems.$el.scrollTop + this.$refs.tabItems.$el.clientHeight,
        scrollHeight: this.$refs.tabItems.$el.scrollHeight
      }
      this.$emit('onScroll', scroll)
    },
    parsingTitle(title) {
      let result = ''
      if(title) {
        for(let i = 0; i < title.length; i++) {
          let char = title[i]
          if(char === '_') {
            result += ' '
          } else {
            result += char
          }
        }
      }

      return result
    },
  },
  mounted() {
    if(this.propTabIndex !== 0){
      this.tab = this.propTabIndex
    }
  },
  watch: {
    propTabIndex(val){
      this.tab = val
    }
  }
}
</script>
<style lang="scss">
.tab-wrapper{
  width:100%;
  height:100%;
  position:relative;

  .theme--dark.v-tabs > .v-tabs-bar {
    background-color: transparent !important;
  }

  .tab {
    border-bottom:1px solid transparent;
    letter-spacing: 0px;
    padding:0 6px !important;
    &:hover{
      * {
        opacity: 1 !important;
      }
    }
    margin-right:16px !important;

    &.button {
      margin-right:0px !important;
      padding:0 !important;
    }

    &.v-tab--active{
      *{
        font-weight: bold;
      }
    }

    .tab-button{
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;

      .theme--dark &{
        background-color: #08132f;
      }
      .theme--light &{
        background-color: #fff;
      }

      &::before{
        content:'';
        display: none !important;
      }
    }
    min-width:48px !important;

    &:nth-last-of-type(1){
      margin-right: 0px !important;
    }

    span {
      .theme--dark &{
        color: #fff;
      }
      .theme--light &{
        
        color: #000;
      }
    }
  }
  .v-tabs{
    border-bottom: 1px solid rgba(128,128,128,0.2);

  }


  .tab-append{
    position:absolute;
    left:0;
    bottom:0;
    width:100%;
    height:40px;
    display:flex;
    flex-direction:row;
    align-items:center;
    border-top: 1px solid rgba(128, 128, 128, 0.2);
  }
  

  .tab-content{
    max-height: calc(100% - 40px);
    height: calc(100% - 40px) !important;
    background-color: transparent !important;
    overflow: auto !important;
    position:relative;
   
    &.append{
      max-height: calc(100% - 80px);
      height: calc(100% - 80px) !important;
    }
  }

  .v-tabs-slider-wrapper {
    .v-tabs-slider{
      border-radius: 0.5rem !important;
    }
  }
}
  


</style>