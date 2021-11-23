<template>
  <new-page
    entity="countries"
    :fields="fields"
    @created="onCreated"
  />
</template>

<script lang="ts">
import NewPage from '~/components/database/NewPage.vue';
import { Component } from 'vue-property-decorator';
import DatabasePageMixin from '~/components/mixins/DatabasePageMixin';

@Component({
  components: { NewPage },
})
export default class extends DatabasePageMixin {
  fields = [
    [ 'name_en', 'text' ],
    [ 'name', 'text' ],
  ];

  onCreated () {
    this.$router.push({ path: '/database/countries' });
  }
}
</script>
