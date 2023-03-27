<template>
  <index-page
    entity="people"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import { FormFieldDefinition } from '~/components/Form';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import Date from '~/components/database/cells/Date.vue';
import Name from '~/components/database/cells/Name.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
      [ 'search', 'text' ],
      [ 'kobo_id', 'text' ],
      [ 'school_year_id', 'text' ],
      [ 'group_id', 'text' ],
      [ 'course_id', 'text' ],
      [ 'school_id', 'text' ],
    ];
  }

  tableColumns = [
    { name: 'actions', slot: 'actions', headerText: false, size: 40 },
    { name: 'id', cell: { type: RecordLink, entity: 'people' }, size: 60 },
    { name: 'student_kobo_no' },
    { name: 'first_name', cell: { type: Name } },
    { name: 'last_name', cell: { type: Name } },
    { name: 'born_on', cell: { type: Date } },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
