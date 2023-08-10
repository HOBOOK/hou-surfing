<template>
  <div class="loading-container">
    <div class="loading-cover">
      <span class="fade_up_animation font-weight-bold delay_600">
        Gyeongho Park

      </span>
      <span class="fade_up_animation delay_600 delay-300">
        Portfolio
      </span>

      <span class="fade_up_animation font-weight-bold text-h4 delay_600 delay-600">
        2023
      </span>
      
      <github-calendar class="ma-8"/>
      
      <div class="d-flex">
        <div
          v-for="(item,idx) in waveText"
          :key="'wavt-' + idx"
          class="fade_up_animation ma-1"
          :class="'delay_' + (idx) * 100"
          style="text-transform: uppercase;"
        >
          {{ item }}
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  export default {
    created() {
      // if(this.$route.meta.layout && this.$route.meta.layout === 'console' && !this.loadingFinish) {
      //   this.start()
      // }
    },
    data() { return {
      isYearShow:false,
      waveText:['s','u','r','f','i','n','g','.','.','.']
    }},
    mounted() {
      setTimeout(()=>{
        this.isYearShow = true
      }, 600)
    },
  }
</script>
<style lang="scss">
.loading-container{
  position: fixed;
  overflow:hidden !important;
  z-index:1000000;
  width:100vw;
  height:100vh;
  left:0;
  top:0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  position:relative;

  .loading-powered{
    position:absolute;
    bottom:12px;
    left:50%;
    transform:translateX(-50%);
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }


  .theme--dark &{
    background-color: #08132f;

  }

  .loading-cover{
    overflow: hidden;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    img{
      height: 96px;
      object-fit: contain;
    }
  }
}
  
</style>
