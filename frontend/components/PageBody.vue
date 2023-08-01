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
    padding:0px 12px;

    &.no-gutters{
        padding:0px;
    }
}
</style>