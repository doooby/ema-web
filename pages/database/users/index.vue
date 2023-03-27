<template>
  <index2-page
    entity="users"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import Name from '~/components/database/cells/Name.vue';
import Index2Page from '~/components/database/pages/index/Index2Page.vue';
import BRecordCell from '~/components/database/cells/BRecordCell.vue';

@Component({
  components: { Index2Page },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    if (!this.currentUser) return [];
    const options = this.currentUser.countries.map(item => ({
      value: item.id,
      text: item.labels.caption,
    }));
    return [
      [ 'country_id', 'list', { options, blank: true } ],
      [ 'search', 'text' ],
    ];
  }

  get tableColumns () {
    return [
      { name: 'actions', slot: 'actions', headerText: false, size: 40 },
      { name: 'id', cell: { type: RecordLink, entity: 'users' }, size: 60 },
      (this.currentUser?.countries && this.currentUser.countries.length > 1
        ? { name: 'country', cell: { type: BRecordCell } }
        : undefined
      ),
      { name: 'login' },
      { name: 'full_name', cell: { type: Name } },
    ].filter(a => a);
  }

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
