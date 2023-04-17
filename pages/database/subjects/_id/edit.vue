<template>
  <edit2-page
    entity="subjects"
    :fields="fields"
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
import { subject } from '~/lib/records';
import RecordForm from '~/components/database/records/subjects/RecordForm.vue';
import Edit2Page from '~/components/database/pages/edit/Edit2Page.vue';

@Component({
  components: {
    Edit2Page,
    RecordForm,
  },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return subject.recordControls();
  }
}
</script>
