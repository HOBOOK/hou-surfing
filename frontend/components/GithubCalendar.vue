<template>
    <div class="github-calendar-container">
        <v-icon class="man" x-large  style="fontSize: 10rem !important;">mdi-surfing</v-icon>
        <v-img src="https://ghchart.rshah.org/1E88E5/HOBOOK"
            style="width:100% !important;"
            contain
        />
    </div>
  
</template>

<script>
export default {
    data() { return{

    }},
    mounted() {
    },
    methods:{
    }
}
</script>

<style lang="scss">
.github-calendar-container{
    width: 100%;
    position: relative;
    .man{
        position: absolute;
        animation: suffing 5s infinite ease-in-out;
        z-index: 10;
        left:30px;
        top:0;
        @keyframes suffing {
            0%{
                left:30px;
                top:0;
                color:#fff;
            }
            25%{
                top:20%;
            }
            50%{
                top: -10%;
            }
            75%{
                top: 15%;
            }
            100% {
                left:calc(100% - 100px);
                top:0;
                color:#1E88E5;
            }
        }
    }
}

</style>