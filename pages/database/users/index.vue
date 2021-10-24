<template>
  <browse-page
    :search-fields="searchFields"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="users"
        :record="dataItem"
        :actions="actions"
      />
    </template>
  </browse-page>
</template>

<script lang="ts">
import Vue from 'vue';
import BrowsePage from '~/components/database/BrowsePage.vue';
import RecordActionsCell from '~/components/database/RecordActionsCell.vue';
import DatabasePageMixin from '~/components/mixins/DatabasePageMixin';

export default Vue.extend({
  components: { RecordActionsCell, BrowsePage },
  mixins: [ DatabasePageMixin ],
  data () {
    return {
      searchFields: [
        [ 'name', 'text' ],
      ],
      tableColumns: [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        { name: 'id', cell: { type: 'link', entity: 'users' }, size: 60 },
        { name: 'country', getText: (user: any) => user.country.caption },
        { name: 'login' },
        { name: 'full_name_en' },
        { name: 'full_name' },
      ],
      actions: [
        { action: 'edit', icon: 'pencil', t: 'db.shared.edit' },
      ],
    };
  },
});
</script>
