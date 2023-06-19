<template>
  <new2-page
    entity="people"
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
import { person } from '~/lib/records';
import RecordForm from '~/components/database/records/people/RecordForm.vue';
import New2Page from '~/components/database/pages/new/New2Page.vue';

@Component({
  components: { RecordForm, New2Page },
})
export default class extends DatabasePage {
  get fields () {
    return person.recordControls({
      countryData: this.$store.state.session.country,
    });
  }

  // onChange (newValues) {
  //   if (!newValues.disabilities?.length) {
  //     newValues = {
  //       ...newValues,
  //       disability_diagnosis: undefined,
  //       assistance_needed: undefined,
  //       assistance_provided: undefined,
  //       disability_note: undefined,
  //     };
  //   }
  //   this.values = newValues;
  // }
}
</script>
