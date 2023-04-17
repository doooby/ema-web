<template>
  <new2-page
    entity="subject_categories"
    :fields="fields"
  >
    <template #layout="{ context, values }">
      <record-form :context="context" :values="values" />
    </template>
  </new2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { subject_category } from '~/lib/records';
import New2Page from '~/components/database/pages/new/New2Page.vue';
import RecordForm from '~/components/database/records/subject_categories/RecordForm.vue';

@Component({
  components: {
    RecordForm,
    New2Page,
  },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return subject_category.recordControls();
  }
}
</script>
