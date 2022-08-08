<template>
  <index-page
    entity="courses"
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
import AssociatedRecordLink from '~/components/database/cells/AssociatedRecordLink.vue';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import * as dbFields from '~/components/database/controls';
import Name from '~/components/database/cells/Name.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
      [ 'search', 'text' ],
      [ 'school_id', dbFields.AssociatedRecord, {
        entity: 'schools',
        params: {
          country_id: this.currentCountryId,
        },
      } ],
      [ 'education_level_id', dbFields.AssociatedRecord, {
        entity: 'education_levels',
        params: {
          country_id: this.currentCountryId,
        },
      } ],
    ];
  }

  tableColumns = [
    { name: 'actions', slot: 'actions', headerText: false, size: 40 },
    { name: 'id', cell: { type: RecordLink, entity: 'courses' }, size: 60 },
    { name: 'name', cell: { type: Name } },
    {
      name: 'school',
      cell: { type: AssociatedRecordLink, entity: 'schools' },
    },
    {
      name: 'education_level',
      cell: { type: AssociatedRecordLink, entity: 'education_levels', noLink: true },
    },
    { name: 'grade' },
    { name: 'accreditation_authority' },
    { name: 'description' },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
