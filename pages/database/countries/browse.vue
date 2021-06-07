<template>
  <div class="page-content -has-submenu">
    <div class="page-menu">
      <search-form
        @search="search"
      />
    </div>
    <div class="em-4">
      <data-table
        :columns="tableColumns"
        :dataset="tableData"
        :headers="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SearchForm from '@c/database/countries/SearchForm.vue';
import { defineTableColumns } from '@c/DataTable';
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
        { key: 'name', caption: 'Name' },
      ),
      tableData: [] as any[],
      searching: this.$api.createRequestState(),
    };
  },
  mounted () {
    this.search({});
  },
  methods: {
    async search (values: FormValues) {
      if (this.searching.running) return;
      const result = await this.$api.query(this.searching, this.$api.queries.countries.search, values);
      if (result !== null) {
        this.tableData = result.records;
      }
    },
  },
});
</script>
