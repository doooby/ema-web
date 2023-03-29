<template>
  <new2-page
    entity="users"
    :fields="fields"
    :show-after-create="true"
  >
    <template #layout="{ context, values }">
      <record-form :context="context" :values="values" />
    </template>
  </new2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { user } from '~/lib/records';
import { FormFieldDefinition } from '~/components/Form';
import New2Page from '~/components/database/pages/new/New2Page.vue';
import RecordForm from '~/components/database/records/users/RecordForm.vue';

@Component({
  components: { New2Page, RecordForm },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return user.entityControls();
  }
}
</script>
