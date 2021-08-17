<template>
  <browse-page
    entity="users"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="users"
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
        { name: 'id', size: 60 },
        { name: 'country', getText: (user: any) => user.country.caption },
        { name: 'login' },
        { name: 'full_name' },
      ],
    };
  },
});
</script>
