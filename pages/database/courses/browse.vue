<template>
  <browse-page
    entity="courses"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="courses"
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
        { name: 'id', cell: { type: 'link', entity: 'courses' }, size: 60 },
        { name: 'name_en' },
        { name: 'name' },
        { name: 'education_level', getText: (record: any) => record.education_level.caption },
      ],
    };
  },
});
</script>
