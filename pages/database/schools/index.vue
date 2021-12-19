<template>
  <index-page
    entity="schools"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="schools"
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
      searchFields: [
        [ 'name', 'text' ],
      ],
      tableColumns: [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        { name: 'id', cell: { type: 'link', entity: 'schools' }, size: 60 },
        { name: 'country', getText: (record: any) => record.country.caption },
        { name: 'name_en' },
        { name: 'name' },
        { name: 'address' },
      ],
    };
  },
});
</script>
