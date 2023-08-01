<template>

  <v-dialog v-model="dialog" max-width="720">
    <template v-slot:activator="{on, attrs}">
      <slot name="activator" v-bind="{on, attrs}"/>
    </template>

      <v-text-field
          v-model="keyword"
          hide-details
          prepend-inner-icon="mdi-magnify"
          solo
          :placeholder="$t('search_hint')"
          @keydown.enter.prevent="searching()"
          :maxlength="50"
          ref="searchField"
      />
  </v-dialog>
</template>

<script>
export default {
  name:'Search',
  data:()=>({
    keyword: '',
    dialog:false,
  }),
  watch:{
    dialog(){
      if(this.dialog) {
        this.keyword = ''
        this.$nextTick(() => {
          this.$refs.searchField.focus()
        })
      }
    }
  },
  methods:{
    searching() {
      this.$emit('search', this.keyword)
      this.dialog = false
    }
  },
  mounted() {
    
  },
  

}
</script>