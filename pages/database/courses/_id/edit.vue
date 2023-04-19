<template>
  <edit2-page
    entity="courses"
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
import { course } from '~/lib/records';
import Edit2Page from '~/components/database/pages/edit/Edit2Page.vue';
import RecordForm from '~/components/database/records/courses/RecordForm.vue';

@Component({
  components: { RecordForm, Edit2Page },
})
export default class extends DatabasePage {
  fields = course.recordControls();
}
</script>
