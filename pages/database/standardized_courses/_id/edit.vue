<template>
  <edit-page
    entity="standardized_courses"
    :fields="fields"
  />
</template>

<script lang="ts">
import EditPage from '~/components/database/EditPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { standardizedCourse } from '~/lib/records';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return standardizedCourse.recordControls(this.currentCountryId);
  }
}
</script>
