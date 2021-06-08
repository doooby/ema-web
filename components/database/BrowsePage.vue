<template>
  <div class="page-content -has-submenu">
    <div class="page-menu">
      <search-form
        :fields="compiledSearchFields"
        @search="search"
      />
    </div>
    <div class="em-4">
      <data-table-view
        :columns="compiledTableColumns"
        :dataset="tableDataSet"
        :header-translation="column => `record.${entity}.${column.name}`"
      >
        <template #row-actions="rowActionProps">
          <b-dropdown-item
            v-if="enableEdit"
            :to="`/database/${entity}/${rowActionProps.item.id}/edit`"
          >
            <b-icon-pencil class="rounded" variant="warning" />
            editace
          </b-dropdown-item>
        </template>
      </data-table-view>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { FormField, FormValues, defineFormFields } from '~/components/Form';
import { TableColumn, defineTableColumns, View as DataTableView } from '~/components/DataTable';
import SearchForm from './SearchForm.vue';
import { notify } from '~/lib/notifier';
import { BIconPencil } from 'bootstrap-vue';

export default Vue.extend({
  components: { SearchForm, DataTableView, BIconPencil },
  props: {
    entity: { type: String, required: true },
    searchFields: { type: Array as PropType<FormField[]>, required: true },
    tableColumns: { type: Array as PropType<TableColumn[]>, required: true },
    enableEdit: { type: Boolean, default: true },
  },
  data () {
    return {
      tableDataSet: [] as any[],
      searching: this.$api.createRequestState(),
    };
  },
  computed: {
    compiledSearchFields (): Readonly<FormField[]> {
      return defineFormFields(...this.searchFields);
    },
    compiledTableColumns (): Readonly<TableColumn[]> {
      return defineTableColumns(...this.tableColumns);
    },
  },
  mounted () {
    this.search({});
  },
  methods: {
    async search (values: FormValues) {
      if (this.searching.running) return;
      const query = (this.$api.queries as any)[this.entity]?.search;
      if (!query) {
        notify('error', `database.BrowsePage: search query is missing for entity ${this.entity}.`);
        return;
      }
      const result: any = await this.$api.query(this.searching, query, values);
      if (result !== null) {
        this.tableDataSet = result.records;
      }
    },
  },
});
</script>
