<template>
  <edit2-page
    entity="projects"
    :fields="fields"
    :show-after-update="1"
  >
    <template #layout="{ context, values }">
      <record-form :context="context" :values="values" />
    </template>
  </edit2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { project } from '~/lib/records';
import Edit2Page from '~/components/database/pages/edit/Edit2Page.vue';
import RecordForm from '~/components/database/records/projects/RecordForm.vue';

@Component({
  components: { Edit2Page, RecordForm },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return project.entityControls();
  }
}
</script>
