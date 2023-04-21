<template>
  <edit2-page
    entity="schools"
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
import Edit2Page from '~/components/database/pages/edit/Edit2Page.vue';
import { school } from '~/lib/records';
import RecordForm from '~/components/database/records/schools/RecordForm.vue';

@Component({
  components: { RecordForm, Edit2Page },
})
export default class extends DatabasePage {
  get fields () {
    return school.recordControls({
      countryData: this.$store.getters['session/countryStaticData'],
    });
  }
}
</script>
