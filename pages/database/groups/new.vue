<template>
  <new2-page
    entity="groups"
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
import { FormFieldDefinition } from '~/components/Form';
import { group } from '~/lib/records';
import New2Page from '~/components/database/pages/new/New2Page.vue';
import RecordForm from '~/components/database/records/groups/RecordForm.vue';

@Component({
  components: { New2Page, RecordForm },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return group.entityControls();
  }
}
</script>
