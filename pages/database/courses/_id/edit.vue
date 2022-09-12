<template>
  <edit-page
    entity="courses"
    :fields="fields"
    @update="onUpdated"
  />
</template>

<script lang="ts">
import EditPage from '~/components/database/EditPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { course } from '~/lib/records';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return course.recordControls({ countryId: this.currentCountryId });
  }

  onUpdated (record: any) {
    this.$router.push({ path: `/database/courses/${record.id}` });
  }
}
</script>
