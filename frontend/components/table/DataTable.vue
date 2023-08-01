<template>
    <div 
        class="data-table"
    >
        <div v-if="!$slots.header && !hideDefaultHeader" class="data-table-default-header">
            <h2 class="data-table-title" v-if="title">
                {{ title ? title : $t('all') }}
            </h2>

            <v-spacer/>

            <div class="mr-2 align-center d-flex">
                <span class="text-h5 font-weight-bold mr-1">
                    {{ itemsLength }}
                </span>
                {{ $t('data_suffix') }}
            </div>

            <v-select
                :items="pageArray"
                @input="page = $event"
                v-model="page"
                dense
                hide-details
                solo
                append-icon=""
                :menu-props="{ bottom: true, offsetY: true }"
                class="page-select"
            > 
                <template v-slot:selection="{item}">
                    <v-chip class="page-count" label color="transparent">
                        {{ item }} <span class="text-caption ml-1 grey--text"> / {{ pageCount }}</span>
                    </v-chip>
                </template>
            </v-select>

            <v-btn icon tile @click="page--" :disabled="page === 1">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <v-btn icon tile @click="page++" :disabled="page === pageCount">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            
            <Search @search="searched">
                <template v-slot:activator="{on, attrs}">
                    <v-tooltip bottom>
                    <template v-slot:activator="tooltip">
                        <v-btn icon tile v-on="on" v-bind="attrs"  v-if="!keyword">
                        <v-icon v-on="tooltip.on" v-bind="tooltip.attrs">mdi-magnify</v-icon>
                        </v-btn>

                        <v-btn v-else icon tile @click="keyword = ''">
                        <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                    <span>
                        {{ $t('search') }}
                    </span>
                    </v-tooltip>
                </template>
            </Search>

            <v-tooltip bottom>
                <template v-slot:activator="{on, attrs}">
                    <v-btn v-on="on" v-bind="attrs" icon tile @click="refresh">
                    <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                </template>
                <span>
                    {{ $t('refresh') }}
                </span>
            </v-tooltip>
        </div>

        <slot name="header"></slot>

        <v-data-table
            v-if="!loading"
            v-bind="$attrs"
            v-on="$listeners"
            :search="keyword"
            hide-default-footer
            :page.sync="page"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            @pagination="pagination"
        >
            <template v-for="(slot, key) in $scopedSlots" v-slot:[key]="scope">
                <slot :name="key" v-bind="scope" />
            </template>
            <template v-slot:no-data>
                <empty :text="$t('no_data')" :subtext="$t('no_data_message')"/>
            </template>

            <template v-slot:no-results>
                <empty :text="$t('no_search_result')" :subtext="$t('no_search_result_message')"/>
            </template>
        </v-data-table>
        

        <loading-data v-else/>
    </div>
</template>

<script>
export default{
    name: 'DataTable',
    inheritAttrs:false,
    props:{
        loading: Boolean,
        hideDefaultHeader: Boolean,
        title:String
    },
    data() { return {
        keyword:'',
        page:1,
        pageCount:0,
        itemsPerPage:10,
        itemsLength:0
    }},
    computed:{
        pageArray() {
            let array = []
            for(let i = 0; i < this.pageCount; i++) {
                array.push((i+1))
            }
            return array
        }
    },
    mounted(){
    },
    methods:{
        searched(keyword){
            this.keyword = keyword
        },
        refresh(){
            this.$emit('refresh')
        },
        pagination(pagination){
            this.itemsLength = pagination.itemsLength
        }
    }
}
</script>

<style lang="scss">

.data-table{
    max-width:100%;

    .data-table-default-header{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom:8px;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none

        .data-table-title{
            font-size: 1.4rem;
            font-weight: bold;
        }
    }

    .page-select{
        max-width: 70px !important;
        .v-input__control{

            .v-input__slot{
                padding:0 !important;
                background-color: transparent !important;
                border: none !important;

                input{
                    display: none !important;
                }
            }
        }

        .page-count{
            width:100%;
            text-align: center;
            max-width:70px;
            width:70px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
        }
    }
    
}
</style>