<template>
<div>
    <v-menu offset-y transition="slide-y-transition" origin="top right" left nudge-top="-16">
        <template v-slot:activator="{on, attrs}">
            <slot name="activator"  v-bind="{on, attrs}"></slot>
            <v-icon v-if="!activator" class="pa-1 header-icon" :class="{flip : flip}" dense v-on="on" v-bind="attrs" @click="onClick()">{{ icon }}</v-icon>
            <slot name="badge"/>
        </template>


        <div class="header-item-content">
            <slot name="content">
            </slot>
        </div>
    </v-menu>
</div>

</template>

<script>

export default{
    props:{
        icon:{
            type: String,
            default:'mdi-chevron-down'
        },
        activator:{
            type:Boolean,
            default:false
        }
    },
    data() { return {
        flip : false
    }},
    methods:{
        onClick(){
            if(!this.flip) {
                this.$emit('click')
                this.flip = true
                setTimeout(()=>{
                    this.flip = false
                },500)
            }
            
        }
    },
    mounted(){
    }
}
</script>

<style lang="scss">
.header-item-content{
    position:relative;
    &::after{
        
    }
}
.header-icon{
    &.flip {
        &::before{
            animation: flip 0.5s linear !important;

        }
    }
}
</style>