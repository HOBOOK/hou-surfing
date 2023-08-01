<template>
  <div class="error-container">
    <div class="error-panel">
      <h1 class="error-code">{{ error.statusCode }}</h1>

      <div class="error-message">
        <v-icon class="icon" color="primary">mdi-alert-circle-outline</v-icon>
        <span class="text">
          {{ error.statusCode === 404 ? $t('error_404') : $t('error_default') }}
        </span>
      </div>
      
      <div class="error-home">
        <v-btn text @click="$router.push('/')">
          {{ $t('error_home') }}
        </v-btn>
        <v-btn text @click="$router.go(-1)" color="primary">
          {{ $t('error_prev') }}
        </v-btn>
      </div>
    </div>
    
  </div>
</template>

<script>
  export default {
    props: ['error'],
    layout: 'errorLayout'
  }
</script>

<style lang="scss">
.error-container{
  margin:0 auto;
  width:100%;
  height:100%;
  overflow:hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position:relative;

  .error-panel{
    padding:0 24px 24px 24px;
    text-align:center;
    z-index:10;
  }

  .error-code{
    font-size:128px !important;
    font-family: Pretendard-Bold !important;
    margin:0;
    padding:0;
    background: url('/bg_login.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-color:#1E88E5;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  .error-message{
    font-size:20px;
    align-items:center;
    display:flex;

    .text{
      margin:0 6px;
      
    }
  }

  .error-home{
    text-align:center;
    margin-top:48px;
    font-size:20px;

    >.v-btn{
      width:120px !important;
    }
  }
}

</style>
  