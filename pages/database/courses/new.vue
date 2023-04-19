<template>
  <new2-page
    entity="courses"
    :fields="fields"
    :show-after-create="true"
  >
    <template #layout="{ context, values }">
      <record-form :context="context" :values="values" />
    </template>
  </new2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { course } from '~/lib/records';
import RecordForm from '~/components/database/records/courses/RecordForm.vue';
import New2Page from '~/components/database/pages/new/New2Page.vue';

@Component({
  components: { RecordForm, New2Page },
})
export default class extends DatabasePage {
    fields = course.recordControls();
}
</script>
