<template>
  <index2-page
    entity="work_agreements"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import Index2Page from '~/components/database/pages/index/Index2Page.vue';
import { FormFieldDefinition } from '~/components/Form';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import Date from '~/components/database/cells/Date.vue';

@Component({
  components: { Index2Page },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
      [ 'search', 'text' ],
    ];
  }

  tableColumns = [
    { name: 'actions', slot: 'actions', headerText: false, size: 40 },
    { name: 'id', cell: { type: RecordLink, noLink: true }, size: 60 },
    // {
    //   name: 'person',
    //   cell: { type: AssociatedRecordLink, entity: 'people' },
    // },
    { name: 'position' },
    { name: 'starts_on', cell: { type: Date } },
    { name: 'ends_on', cell: { type: Date } },
    { name: 'resigned_on', cell: { type: Date } },
    { name: 'created_at', cell: { type: Date } },
    { name: 'updated_at', cell: { type: Date } },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
