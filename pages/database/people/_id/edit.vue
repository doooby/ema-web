<template>
  <edit-page
    entity="people"
    :fields="fields"
    :no-default-redirect="true"
    @updated="onUpdated"
  />
</template>

<script lang="ts">
import EditPage from '~/components/database/EditPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { person } from '~/lib/records';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return person.recordControls();
  }

  onUpdated (record: any) {
    this.$router.push({ path: `/database/people/${record.id}` });
  }
}
</script>
