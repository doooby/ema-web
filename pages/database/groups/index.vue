<template>
  <index-page
    entity="groups"
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

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
    ];
  }

  tableColumns = [
    { name: 'actions', slot: 'actions', headerText: false, size: 40 },
    { name: 'id', cell: { type: 'link', entity: 'groups' }, size: 60 },
    { name: 'school', getText: (record: any) => record.school.labels.caption },
    { name: 'course', getText: (record: any) => record.course.labels.caption },
    { name: 'name' },
    { name: 'year' },
    { name: 'term' },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
