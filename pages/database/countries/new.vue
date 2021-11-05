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
    [ 'name', 'text' ],
  ];

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/countries/${recordId}` });
  }
}
</script>
