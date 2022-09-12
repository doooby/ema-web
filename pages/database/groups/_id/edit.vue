<template>
  <edit-page
    entity="groups"
    :fields="fields"
    @update="onUpdated"
  />
</template>

<script lang="ts">
import EditPage from '~/components/database/EditPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { group } from '~/lib/records';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return group.recordControls({ countryId: this.currentCountryId });
  }

  onUpdated (record: any) {
    this.$router.push({ path: `/database/groups/${record.id}` });
  }
}
</script>
