<template>
  <new-page
    entity="subjects"
    :fields="fields"
    @created="onCreated"
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
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
      ...subject.recordControls(),
    ];
  }

  onCreated () {
    this.$router.push({ path: '/database/subjects' });
  }
}
</script>
