<template>
  <new2-page
    entity="donors"
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
import New2Page from '~/components/database/pages/new/New2Page.vue';
import { donor } from '~/lib/records';
import RecordForm from '~/components/database/records/donors/RecordForm.vue';

@Component({
  components: { New2Page, RecordForm },
})
export default class extends DatabasePage {
  fields = donor.recordControls();
}
</script>
