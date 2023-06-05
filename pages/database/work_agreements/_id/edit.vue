<template>
  <edit2-page
    entity="work_agreements"
    :fields="fields"
  >
    <template #layout="{ context, values }">
      <record-form :context="context" :values="values" />
    </template>
  </edit2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Edit2Page from '~/components/database/pages/edit/Edit2Page.vue';
import RecordForm from '~/components/database/records/work_agreements/RecordForm.vue';
import { DatabasePage } from '~/components';
import { work_agreement } from '~/lib/records';

@Component({
  components: { Edit2Page, RecordForm },
})
export default class extends DatabasePage {
  get fields () {
    return work_agreement.recordControls({
      countryData: this.$store.getters['session/countryStaticData'],
    });
  }
}
</script>
