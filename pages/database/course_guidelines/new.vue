<template>
  <new-page
    entity="course_guidelines"
    :fields="fields"
  />
</template>

<script lang="ts">
import NewPage from '~/components/database/NewPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { courseGuideline } from '~/lib/records';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return courseGuideline.recordControls(this.currentCountryId);
  }
}
</script>
