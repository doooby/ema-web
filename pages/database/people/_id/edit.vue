<template>
  <edit2-page
    entity="people"
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
import { person } from '~/lib/records';
import RecordForm from '~/components/database/records/people/RecordForm.vue';
import Edit2Page from '~/components/database/pages/edit/Edit2Page.vue';

@Component({
  components: { RecordForm, Edit2Page },
})
export default class extends DatabasePage {
  get fields () {
    return person.recordControls({
      countryData: this.$store.state.session.country,
    });
  }
}
</script>
