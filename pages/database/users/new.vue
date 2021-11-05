<template>
  <new-page
    entity="users"
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
    [ 'country', 'associatedRecord', { entity: 'countries' } ],
    [ 'login', 'text' ],
    [ 'full_name_en', 'text' ],
    [ 'full_name', 'text' ],
  ];

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/users/${recordId}` });
  }
}
</script>
