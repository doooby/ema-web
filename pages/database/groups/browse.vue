<template>
  <browse-page
    entity="groups"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="groups"
        :record="dataItem"
        :edit="true"
      />
    </template>
  </browse-page>
</template>

<script lang="ts">
import Vue from 'vue';
import BrowsePage from '~/components/database/BrowsePage.vue';
import RecordActionsCell from '~/components/database/RecordActionsCell.vue';

export default Vue.extend({
  components: { RecordActionsCell, BrowsePage },
  layout: 'database',
  data () {
    return {
      searchFields: [
        { name: 'name', control: 'text' },
      ],
      tableColumns: [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        { name: 'id', cell: { type: 'link', entity: 'groups' }, size: 60 },
        { name: 'name' },
        { name: 'year' },
        { name: 'course', cell: { type: 'assoc', entity: 'courses' } },
        { name: 'school', cell: { type: 'assoc', entity: 'schools' } },
      ],
    };
  },
});
</script>
