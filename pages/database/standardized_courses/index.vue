<template>
  <index-page
    entity="standardized_courses"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import IndexPage from '~/components/database/page/index/IndexPage.vue';
import { asFieldType, FormFieldDefinition } from '~/components/Form';
import AssociatedRecordLink from '~/components/database/cells/AssociatedRecordLink.vue';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import Name from '~/components/database/cells/Name.vue';
import AbbreviatedRecordField from '~/components/database/records/AbbreviatedRecordField.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
      [ 'search', 'text' ],
      [ 'education_level_id', asFieldType(AbbreviatedRecordField), {
        entity: 'education_levels',
        params: {
          country_id: this.currentCountryId,
        },
      } ],
    ];
  }

  tableColumns = [
    { name: 'actions', slot: 'actions', headerText: false, size: 40 },
    { name: 'id', cell: { type: RecordLink, entity: 'standardized_courses' }, size: 60 },
    {
      name: 'education_level',
      cell: { type: AssociatedRecordLink, entity: 'education_levels', noLink: true },
    },
    { name: 'name', cell: { type: Name } },
    { name: 'grade' },
    { name: 'accreditation_authority' },
    { name: 'description' },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
