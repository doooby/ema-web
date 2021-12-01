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
import { DatabasePage } from '~/components';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  fields = [
    [ 'name_en', 'text' ],
    [ 'name', 'text' ],
  ];

  onCreated () {
    this.$router.push({ path: '/database/countries' });
  }
}
</script>
