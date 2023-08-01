<template>
  <div class="loading-container">
    <div class="loading-cover">
      <strong>{{ $t('connecting') }}...</strong>
      <br/>
      <img  src="/logo_v2/s01.png" height="80"/>
    </div>

    <div class="loading-powered">
      <span class="text-caption">Powered By</span> 
      <a href="http://www.vazilcompany.com" target="_blank"><img src="/logo-color.png" height="16"/></a>
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
    mounted() {
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
