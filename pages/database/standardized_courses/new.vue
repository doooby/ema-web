<template>
  <new2-page
    entity="standardized_courses"
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
import RecordForm from '~/components/database/records/standardized_courses/RecordForm.vue';
import { standardized_course } from '~/lib/records';
import New2Page from '~/components/database/pages/new/New2Page.vue';

@Component({
  components: { RecordForm, New2Page },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return standardized_course.recordControls();
  }
}
</script>
