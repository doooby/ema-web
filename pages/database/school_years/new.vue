<template>
  <new2-page
    entity="school_years"
    :fields="fields"
  >
    <template #layout="{ context, values }">
      <record-form :context="context" :values="values" />
    </template>
  </new2-page>
</template>

<script lang="ts">
import New2Page from '~/components/database/pages/new/New2Page.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { school_year } from '~/lib/records';
import RecordForm from '~/components/database/records/school_years/RecordForm.vue';

@Component({
  components: { New2Page, RecordForm },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
      ...school_year.controls.all(),
    ];
  }
}

</script>
