<template>
  <new2-page
    entity="projects"
    :fields="fields"
    :show-after-create="true"
  >
    <template #layout="{ context, values }">
      <ProjectForm :context="context" :values="values" />
    </template>
  </new2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { project } from '~/lib/records';
import New2Page from '~/components/database/pages/new/New2Page.vue';
import ProjectForm from '~/components/database/records/projects/ProjectForm.vue';

@Component({
  components: { New2Page, ProjectForm },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return project.recordControls();
  }
}
</script>
