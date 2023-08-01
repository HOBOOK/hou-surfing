<template>
<v-row no-gutters class="page-title" align="center" :style="'background:' + background">
  <v-btn icon tile v-if="back" @click="$router.push(back)" class="mr-2" small>
    <v-icon>mdi-chevron-left</v-icon>
  </v-btn>
  
  <span class="title">
    <slot name="title">
    </slot>

    <span v-if="!$slots.title">{{title}}</span>

  </span>


  <slot name="subtitle">
  </slot>
  <h4 class="text-subtitle-2 mx-2" v-if="!$slots.subtitle">{{subtitle}}</h4>

  <v-breadcrumbs class="py-0" :items="breadcrumbsItems" v-if="breadcrumbs"></v-breadcrumbs>

  <v-spacer/>
  <slot name="right">

  </slot>
</v-row>

</template>

<script>
export default {
  name:'HeaderPageTitle',
  props:{
    title:{
      type: String,
    },
    subtitle:{
      type: String,
    },
    background:{
      type: String,
      default:''
    },
    breadcrumbs:Boolean,
    back: String
  },
  data:()=>({
    breadcrumbsItems:[]
  }),
  methods:{
    generateBreadcrumbs(){
      if(this.breadcrumbs) {
        const pathArray = this.$route.path.split('/');
        pathArray.shift();
        this.breadcrumbsItems = [];
        pathArray.forEach((path, index) => {
          let to = '/' + pathArray.slice(0, index+1).join('/');
          this.breadcrumbsItems.push({ text: path, href: to, disabled: index === pathArray.length - 1 });
        });
      }
    }
  },
  mounted() {
    this.generateBreadcrumbs()
  },
  

}
</script>
<style lang="scss">
.page-title {
  min-width: 320px;
  padding:12px 18px;
  height: 60px !important;
  .title{
    font-size: 1.4rem !important;
    font-weight: bold !important;
  }

  h4{
    margin:0;
    opacity: 0.7;
    @media (max-width: 767px){
      display: none;
    }
  }
}
</style>