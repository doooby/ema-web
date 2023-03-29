<template>
  <index2-page
    entity="projects"
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

@Component({
  components: { Index2Page },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.$store.getters['session/countryId'] } ],
      [ 'search', 'text' ],
    ];
  }

  tableColumns = [
    { name: 'actions', slot: 'actions', headerText: false, size: 40 },
    { name: 'id', cell: { type: RecordLink, entity: 'projects' }, size: 60 },
    { name: 'name', cell: { type: Name } },
    { name: 'code' },
    { name: 'short_name_en' },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
