<template>
  <edit2-page
    entity="standardized_courses"
    :fields="fields"
    :show-after-update="true"
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
import { standardized_course } from '~/lib/records';
import RecordForm from '~/components/database/records/standardized_courses/RecordForm.vue';
import Edit2Page from '~/components/database/pages/edit/Edit2Page.vue';

@Component({
  components: { RecordForm, Edit2Page },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return standardized_course.recordControls({
      countryData: this.$store.getters['session/countryStaticData'],
    });
  }
}
</script>
