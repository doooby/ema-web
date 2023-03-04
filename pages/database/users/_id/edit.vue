<template>
  <edit2-page
    entity="users"
    :fields="fields"
    :show-after-update="true"
  >
    <template #layout="{ context, values }">
      <record-form :context="context" :values="values" />
    </template>
  </edit2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { user } from '~/lib/records';
import Edit2Page from '~/components/database/pages/edit/Edit2Page.vue';
import RecordForm from '~/components/database/records/users/RecordForm.vue';

@Component({
  components: { Edit2Page, RecordForm },
})
export default class extends DatabasePage {
  fields = [
    ...user.entityControls(),
  ];
}
</script>
