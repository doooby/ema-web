<template>
  <new2-page
    entity="work_agreements"
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
import New2Page from '~/components/database/pages/new/New2Page.vue';
import { work_agreement } from '~/lib/records';
import RecordForm from '~/components/database/records/work_agreements/RecordForm.vue';

@Component({
  components: { New2Page, RecordForm },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return work_agreement.recordControls({
      countryData: this.$store.getters['session/countryStaticData'],
    });
  }
}
</script>
