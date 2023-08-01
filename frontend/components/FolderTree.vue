<template>
    <ul class="folder-tree">
      <li v-for="folder in folders" :key="folder.id + key">
        <span class="folder-children" v-if="folder.toggleChildren"></span>
        <div class="folder-tree-item" :class="{highlight : highlight == folder.id}" @click="onClickTree(folder)">
            <v-icon class="folder-children-icon" small v-if="folder.subFolders">mdi-chevron-{{ folder.toggleChildren ? 'down' : 'right' }}</v-icon>

            <span class="item-content">
                <v-icon v-if="iconOption" small class="mr-1" :color="getColorByType(folder.type)">
                    {{ getIconByType(folder.type) }}
                </v-icon>
                {{ folder.name ? folder.name : 'unknown' }}
            </span>

            <v-spacer/>
            <v-btn x-small icon @click.stop="onClickHide(folder)" v-if="hideOption">
                <v-icon x-small>mdi-eye{{ folder.model?.visible ? '' : '-off' }}</v-icon>
            </v-btn>
        </div>
        <folder-tree :folders="folder.subFolders" @click:item="onClickItem" :highlight="highlight" v-if="folder.subFolders &&  folder.toggleChildren" :hideOption="hideOption" :iconOption="iconOption"></folder-tree>
      </li>
    </ul>
  </template>
  
  <script>
  import Vue from 'vue';
  
  export default Vue.extend({
    name: 'folder-tree',
    props: {
      folders: Array,
      highlight:[Number, String],
      hideOption:Boolean,
      iconOption: Boolean,
    },
    data(){
        return {
            key:0,
            iconType:{
                group:{
                    icon:'mdi-cube-outline',
                    color:'primary'
                },
                mesh:{
                    icon:'mdi-triangle-outline',
                    color:'green'
                },
                sprite:{
                    icon:'mdi-texture',
                    color:'grey'
                },
                scene:{
                    icon:'mdi-factory',
                    color:''
                },
                object3d: {
                    icon:'mdi-cube-outline',
                    color:'primary'
                }
            }
        }
    },
    methods:{
        onClickItem(folder){
            this.$emit('click:item', folder)
        },

        onClickTree(folder){
            if(folder.subFolders) {
                folder.toggleChildren = !folder.toggleChildren
                this.key++
            } 
            this.onClickItem(folder)
        },

        onClickHide(folder){
            if(folder.model) {
                folder.model.visible = !folder.model.visible
            }
        },

        getIconByType(type) {
            if(type) {
                type = type.toLowerCase()
                if(this.iconType[type]){
                    return this.iconType[type].icon
                }
            }
            return 'mdi-file-outline'

        },

        getColorByType(type) {
            if(type) {
                type = type.toLowerCase()
                if(this.iconType[type]){
                    return this.iconType[type].color
                }
            }
            return ''
            
        }
    }
  });
  </script>


<style lang="scss">
.folder-tree{
    list-style:none;
    margin:0;
    padding:0;
    padding-left:24px;

    li{
        margin:0;
        padding:0;
        position:relative;

        .folder-tree-item{
            display:flex;
            flex-direction:row;
            max-width:calc(100% - 6px);
            position:relative;
            cursor:pointer;
            padding-top:6px;
            padding-bottom:6px;
            opacity:0.72;
            &:hover{
                opacity:1;
            }
            &.highlight{
                opacity:1 !important;
                &::after{
                    position:absolute;
                    content:'';
                    left: -6px;
                    top:0;
                    width: 100%;
                    height:100%;
                    border-radius:0.25rem;

                    .theme--light &{
                        background-color:#cccccc30;
                    }
                    .theme--dark &{
                        background-color:#00000030;
                    }
                    z-index:-1;
                }
            }

            .item-content{
                max-width:calc(100% - 28px);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;  /* 말줄임 적용 */

            }

            .folder-children-icon{
                position:absolute;
                left:-21px;
                top:9px;
            }
        }

        .folder-children{
            position:absolute;
            width:1px;
            left:-14px;
            top:33px;
            height:calc(100% - 38px);
            background:$default-border-color;
        }
    }
}

</style>