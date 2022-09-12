<template>
  <new-page
    entity="schools"
    :fields="fields"
    @create="onCreated"
  />
</template>

<script lang="ts">
import NewPage from '~/components/database/NewPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { school } from '~/lib/records';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
      ...school.recordControls(),
    ];
  }

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/schools/${recordId}` });
  }
}
</script>
