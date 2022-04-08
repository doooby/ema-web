<template>
  <index-page
    entity="subjects"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import IndexPage from '~/components/database/page/index/IndexPage.vue';
import { FormFieldDefinition } from '~/components/Form';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import AssociatedRecordLink from '~/components/database/cells/AssociatedRecordLink.vue';

@Component({
  components: { IndexPage },
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
    { name: 'id', cell: { type: RecordLink, onlyId: true }, size: 60 },
    {
      name: 'education_level',
      cell: { type: AssociatedRecordLink, entity: 'education_levels', noLink: true },
    },
    { name: 'name_en' },
    { name: 'name' },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
