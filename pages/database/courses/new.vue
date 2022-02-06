<template>
  <new-page
    entity="courses"
    :fields="fields"
    @created="onCreated"
  />
</template>

<script lang="ts">
import NewPage from '~/components/database/NewPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { course } from '~/lib/records';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return course.recordControls({ countryId: this.currentCountryId });
  }

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/courses/${recordId}` });
  }
}
</script>
