<template>
  <browse-page
    entity="subjects"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="subjects"
        :record="dataItem"
        :edit="true"
      />
    </template>
  </browse-page>
</template>

<script lang="ts">
import Vue from 'vue';
import BrowsePage from '~/components/database/BrowsePage.vue';
import RecordCellActions from '~/components/database/RecordCellActions.vue';

export default Vue.extend({
  components: { RecordCellActions, BrowsePage },
  layout: 'database',
  data () {
    return {
      searchFields: [
        [ 'name', 'text' ],
      ],
      tableColumns: [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        { name: 'id', cell: { type: 'link', entity: 'subjects', onlyId: true }, size: 60 },
        { name: 'name_en' },
        { name: 'name' },
      ],
    };
  },
});
</script>
