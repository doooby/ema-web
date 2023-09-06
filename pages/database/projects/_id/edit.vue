<template>
  <edit2-page
    entity="projects"
    :fields="fields"
    :show-after-update="true"
  >
    <template #layout="{ context, values }">
      <ProjectForm :context="context" :values="values" />
    </template>
  </edit2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { project } from '~/lib/records';
import Edit2Page from '~/components/database/pages/edit/Edit2Page.vue';
import ProjectForm from '~/components/database/records/projects/ProjectForm.vue';

@Component({
  components: { Edit2Page, ProjectForm },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return project.recordControls();
  }
}
</script>
