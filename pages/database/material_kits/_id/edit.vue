<template>
  <edit2-page
    entity="material_kits"
    :fields="fields"
  >
    <template #layout="{ context, values }">
      <record-form :context="context" :values="values" />
    </template>
  </edit2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Edit2Page from '~/components/database/pages/edit/Edit2Page.vue';
import RecordForm from '~/components/database/records/material_kits/RecordForm.vue';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { material_kit } from '~/lib/records';

@Component({
  components: { Edit2Page, RecordForm },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return material_kit.recordControls();
  }
}
</script>
