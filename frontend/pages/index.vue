<template >
  <div>
    <page-body class="index-container">
        
      <v-row no-gutters align="center" justify="center">
        <v-col cols="12">

          <v-card class="index-content" color="transparent" min-width="360" style="width:100%;" flat>
            <v-card-title>
              <v-list-item two-line class="pa-0 ma-0">
                <v-list-item-avatar :size="128">
                  <v-img src="https://avatars.githubusercontent.com/u/37508173?v=4"/>
                </v-list-item-avatar>
                <v-list-item-content>

                  <v-list-item-subtitle class="index-subtitle grey--text fade_up_animation">
                    개발의 서핑은 끝이없어요 ㅠ
                  </v-list-item-subtitle>

                  
                  <v-list-item-title class="index-title fade_up_animation delay_300">
                    안녕하세요
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card-title>
          </v-card>
        </v-col>

        <v-col cols="12">

          <github-calendar class="fade_up_animation delay_600"/>
        </v-col>

      </v-row>

    </page-body>
  </div>
</template>

<script>


export default {
  components:{
  },
  data() { return {

  }},
  methods:{
  }
}
</script>

<style lang="scss">
.index-container{
  display: flex;
  flex-direction: row;
  align-items: center;
  width:100%;

  .index-title{
    font-size: 2.6rem;
    font-family: Pretendard-Bold !important;

  }
  .index-subtitle{
    font-size:1.3rem;
    font-family: Pretendard-Medium !important;
  }

  .index-item{

    *{
      font-family: Pretendard-Medium !important;
    }
  }
}
</style>
