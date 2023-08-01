<template>
<div class="loading-data-container"> 
      <v-icon x-large :color="iconColor" class="rotating">{{ icon }}</v-icon>
</div>
</template>

<script>
export default {
  name:'Empty',
  props:{
    icon:{
      type:String,
      default: 'mdi-refresh'
    },
    iconColor:{
      type:String,
      default:'primary'
    }
  },
  data:()=>({
  }),
  mounted() {

  },
  
}
</script>

<style lang="scss">
.loading-data-container{
  position: absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

</style>