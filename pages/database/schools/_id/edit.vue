<template>
  <edit-page
    entity="schools"
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
import { school } from '~/lib/records';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return school.recordControls({ countryId: null });
  }

  onUpdated (record: any) {
    this.$router.push({ path: `/database/schools/${record.id}` });
  }
}
</script>
