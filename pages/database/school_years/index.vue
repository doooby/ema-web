<template>
  <index-page
    entity="school_years"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :actions="actions"
  />
</template>

<script lang="ts">
import IndexPage from '~/components/database/page/index/IndexPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import AssociatedRecordLink from '~/components/database/cells/AssociatedRecordLink.vue';
import RecordLink from '~/components/database/cells/RecordLink.vue';

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
    { name: 'id', cell: { type: RecordLink, entity: 'groups' }, size: 60 },
    {
      name: 'education_level',
      cell: { type: AssociatedRecordLink, entity: 'education_levels' },
    },
    { name: 'year_label' },
    { name: 'name_en' },
    { name: 'name' },
  ];

  actions = [
    // { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
