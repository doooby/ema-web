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
import { user } from '~/lib/records';

@Component({
  components: { NewPage },
})
export default class extends DatabasePageMixin {
  fields = [
    ...user.entityControls(),
  ];

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/users/${recordId}` });
  }
}
</script>
