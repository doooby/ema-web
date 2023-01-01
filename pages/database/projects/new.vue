<template>
  <new-page
    entity="projects"
    :fields="fields"
    @create="onCreated"
  />
</template>

<script lang="ts">
import NewPage from '~/components/database/NewPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { project } from '~/lib/records';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.$store.getters['session/countryId'] } ],
      ...project.recordControls(),
    ];
  }

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/projects/${recordId}` });
  }
}
</script>
