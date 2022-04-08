<template>
  <edit-page
    entity="subject_categories"
    :fields="fields"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import EditPage from '~/components/database/EditPage.vue';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { subject } from '~/lib/records';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return subject.recordControls();
  }
}
</script>
