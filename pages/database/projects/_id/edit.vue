<template>
  <edit-page
    entity="projects"
    :fields="fields"
    @update="onUpdated"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import EditPage from '~/components/database/EditPage.vue';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { project } from '~/lib/records';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return project.recordControls();
  }

  onUpdated (record: any) {
    this.$router.push({ path: `/database/projects/${record.id}` });
  }
}
</script>
