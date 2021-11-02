<template>
  <edit-page
    entity="users"
    :fields="fields"
    :no-default-redirect="true"
    @updated="onUpdated"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import EditPage from '~/components/database/EditPage.vue';
import DatabasePageMixin from '~/components/mixins/DatabasePageMixin';

@Component({
  components: { EditPage },
})
export default class extends DatabasePageMixin {
  fields = [
    [ 'country', 'associatedRecord', { entity: 'countries' } ],
    [ 'login', 'text' ],
    [ 'full_name_en', 'text' ],
    [ 'full_name', 'text' ],
  ];

  onUpdated (record: any) {
    this.$router.push({ path: `/database/users/${record.id}` });
  }
}
</script>
