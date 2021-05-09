<template>
  <div class="page-content -has-submenu">
    <div class="page-menu">
      <search-form
        @search="search"
      />
    </div>
    <div>
      <data-table
        :columns="tableColumns"
        :rows="tableRows"
        :headers="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SearchForm from '@c/database/users/SearchForm.vue';
import { defineTableColumns, TableRow } from '@c/DataTable';
import DataTable from '@c/DataTable/View.vue';
import { FormValues } from '@c/Form';

export default Vue.extend({
  components: {
    SearchForm,
    DataTable,
  },
  layout: 'database',
  data () {
    return {
      tableColumns: defineTableColumns(
        { key: 'id', caption: 'ID' },
        { key: 'login', caption: 'Login' },
        { key: 'full_name', caption: 'Full Name' },
      ),
      tableRows: [] as TableRow[],
      searching: this.$api.createRequestState(),
    };
  },
  methods: {
    search (values: FormValues) {
      if (this.searching.running) return;
      this.$api.query(this.searching, async (api) => {
        const records = await api.users.search(this.searching, values);
        if (records !== null) {
          this.tableRows = records.list.map(user => ({
            key: String(user.id),
            values: this.tableColumns.map(column => (user as any)[column.key]),
          }));
        }
      });
    },
  },
});
</script>
