<template>
<div>
    <v-menu offset-y transition="slide-y-transition" origin="top right" left nudge-top="-16">
        <template v-slot:activator="{on, attrs}">
            <slot name="activator"  v-bind="{on, attrs}"></slot>
            <v-icon v-if="!activator" class="pa-1" dense v-on="on" v-bind="attrs" @click="onClick()">{{ icon }}</v-icon>
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
    methods:{
        onClick(){
            this.$emit('click')
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
</style>