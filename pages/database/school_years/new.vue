<template>
  <new-page
    entity="school_years"
    :fields="fields"
  />
</template>

<script lang="ts">
import NewPage from '~/components/database/NewPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { schoolYear } from '~/lib/records';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.$store.getters['session/countryId'] } ],
      ...schoolYear.recordControls(),
    ];
  }
}

</script>
