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
        { key: 'fullName', caption: 'Full Name' },
      ),
      tableRows: [] as TableRow[],
    };
  },
  methods: {
    search (_values: FormValues) {

    },
  },
});
</script>
