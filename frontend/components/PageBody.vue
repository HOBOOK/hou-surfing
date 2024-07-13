<template>
    <div class="page-body" :class="{'no-gutters' : noGutters}">
        <slot/>
    </div>
</template>

<script>
export default{
    name:'PageBody',
    props:{
        noGutters:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        
    }
}
</script>

<style lang="scss">
.page-body{

    &.no-gutters{
        padding:0px;
    }
}
</style>