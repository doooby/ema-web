<template>
  <browse-page
    entity="semester_groups"
    :search-fields="[]"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="semester_groups"
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
      tableColumns: [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        { name: 'id', cell: { type: 'link', entity: 'semester_groups' }, size: 60 },
        { name: 'course', getText: (record: any) => record.course.caption },
        { name: 'name' },
        { name: 'year_start' },
        { name: 'semester' },
      ],
    };
  },
});
</script>
