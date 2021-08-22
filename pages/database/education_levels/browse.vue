<template>
  <browse-page
    entity="education_levels"
    :search-fields="[]"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="education_levels"
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
        { name: 'id', cell: { type: 'link', entity: 'education_levels', onlyId: true }, size: 60 },
        { name: 'country', getText: (record: any) => record.country.caption },
        { name: 'name' },
        { name: 'grade' },
        { name: 'start_age' },
        { name: 'years_length' },
        { name: 'semesters' },
        { name: 'mandatory' },
      ],
    };
  },
});
</script>
