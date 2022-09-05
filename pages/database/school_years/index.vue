<template>
  <index-page
    entity="school_years"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :actions="actions"
  />
</template>

<script lang="ts">
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import MultipleAssociatedRecordsLinks from '~/components/database/cells/MultipleAssociatedRecordsLinks.vue';
import Name from '~/components/database/cells/Name.vue';

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
      name: 'education_levels',
      cell: { type: MultipleAssociatedRecordsLinks, entity: 'education_levels', noLink: true },
      size: 400,
    },
    { name: 'year_label' },
    { name: 'name', cell: { type: Name } },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
