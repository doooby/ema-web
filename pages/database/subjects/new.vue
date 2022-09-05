<template>
  <new-page
    entity="subjects"
    :fields="fields"
  />
</template>

<script lang="ts">
import NewPage from '~/components/database/NewPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { subject } from '~/lib/records';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.$store.getters['session/countryId'] } ],
      ...subject.recordControls(),
    ];
  }
}
</script>
