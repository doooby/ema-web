<template>
  <new2-page
    entity="schools"
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
import { FormFieldDefinition } from '~/components/Form';
import { school } from '~/lib/records';
import New2Page from '~/components/database/pages/new/New2Page.vue';
import RecordForm from '~/components/database/records/schools/RecordForm.vue';

@Component({
  components: { RecordForm, New2Page },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return school.recordControls({
      countryData: this.$store.getters['session/countryStaticData'],
      addressSystem: this.$store.state.session.countryData?.addressSystem,
      api: this.$api,
    });
  }
}
</script>
