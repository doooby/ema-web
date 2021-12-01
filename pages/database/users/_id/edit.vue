<template>
  <edit-page
    entity="users"
    :fields="fields"
    @updated="onUpdated"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import EditPage from '~/components/database/EditPage.vue';
import { DatabasePage } from '~/components';
import { user } from '~/lib/records';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  fields = [
    ...user.entityControls(),
  ];

  onUpdated (record: any) {
    this.$router.push({ path: `/database/users/${record.id}` });
  }
}
</script>
