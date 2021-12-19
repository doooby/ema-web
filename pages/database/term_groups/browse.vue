<template>
  <index-page
    entity="term_groups"
    :search-fields="[]"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="term_groups"
        :record="dataItem"
        :edit="true"
      />
    </template>
  </index-page>
</template>

<script lang="ts">
import Vue from 'vue';
import IndexPage from '~/components/database/page/index/IndexPage.vue';
import RecordCellActions from '~/components/database/RecordCellActions.vue';

export default Vue.extend({
  components: { RecordCellActions, IndexPage },
  layout: 'database',
  data () {
    return {
      tableColumns: [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        { name: 'id', cell: { type: 'link', entity: 'term_groups' }, size: 60 },
        { name: 'school', getText: (record: any) => record.school.caption },
        { name: 'course', getText: (record: any) => record.course.caption },
        { name: 'name' },
        { name: 'year_start' },
        { name: 'term' },
      ],
    };
  },
});
</script>
