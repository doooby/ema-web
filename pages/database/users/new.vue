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
import { DatabasePage } from '~/components';
import { user } from '~/lib/records';
import { FormFieldDefinition } from '~/components/Form';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return [
      [ 'country', 'hidden', { value: this.currentCountryId } ],
      ...user.entityControls(),
    ];
  }

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/users/${recordId}` });
  }
}
</script>
