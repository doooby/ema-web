<template>
  <index2-page
    entity="groups"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls, FormFieldDefinition } from '~/components/Form';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import Index2Page from '~/components/database/pages/index/Index2Page.vue';
import BRecordLinkCell from '~/components/database/cells/BRecordCell.vue';
import { dbFields } from '~/components/database/fields';

@Component({
  components: { Index2Page },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
      [ 'search', controls.text ],
      [ 'school', dbFields.selectBRecord, { entity: 'schools' } ],
      [ 'course_id', controls.text ],
    ];
  }

  tableColumns = [
    { name: 'actions', slot: 'actions', headerText: false, size: 40 },
    { name: 'id', cell: { type: RecordLink, entity: 'groups' }, size: 60 },
    {
      name: 'school',
      cell: { type: BRecordLinkCell, entity: 'schools' },
    },
    {
      name: 'course',
      cell: { type: BRecordLinkCell, entity: 'courses' },
    },
    { name: 'name_en' },
    { name: 'term', size: 80 },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
