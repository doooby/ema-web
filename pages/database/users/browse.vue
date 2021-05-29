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
      >
        <template #row-actions="rowActionProps">
          <b-dropdown-item
            :to="`/database/users/${rowActionProps.item.id}/edit`"
          >
            <b-icon-pencil class="rounded" variant="warning" />
            editace
          </b-dropdown-item>
        </template>
      </data-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SearchForm from '@c/database/users/SearchForm.vue';
import { defineTableColumns } from '@c/DataTable';
import DataTable from '@c/DataTable/View.vue';
import { FormValues } from '@c/Form';
import { BIconPencil } from 'bootstrap-vue';

export default Vue.extend({
  components: {
    SearchForm,
    DataTable,
    BIconPencil,
  },
  layout: 'database',
  data () {
    return {
      tableColumns: defineTableColumns(
        { key: 'id', caption: 'ID' },
        { key: 'login', caption: 'Login' },
        { key: 'country', caption: 'Country', value: user => user.country.designation },
        { key: 'full_name', caption: 'Full Name' },
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
      const result = await this.$api.query(this.searching, this.$api.queries.users.search, values);
      if (result !== null) {
        this.tableData = result.records;
      }
    },
  },
});
</script>
