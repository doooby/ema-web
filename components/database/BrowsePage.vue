<template>
  <div class="page-content -has-submenu">
    <div class="page-menu">
      <search-form
        :value="searchValues"
        :fields="searchFields"
        @search="onSearch"
      />
    </div>
    <div class="container-fluid emy-4">
      <div class="border-primary row no-gutters emb-2">
        <div class="col-xl-4">
          {{ $t('db.records_count') }}: {{ records ? records.total : 0 }}
        </div>
        <div class="col-xl-4">
          order by: input
        </div>
        <div class="col-xl-4">
          <records-pagination
            v-if="records"
            :current="records.page"
            :pages-count="records.pages_count"
            @select="onSelectPage"
          />
        </div>
      </div>
      <div class="row no-gutters">
        <data-table-view
          class="col"
          :columns="tableColumns"
          :dataset="records ? records.records : []"
          :query-state="searchQueryState"
          :templates="columnTemplates"
        >
          <template #header-cell="{ column }">
            {{ $t(`record.${entity}.${column.name}`) }}
          </template>
        </data-table-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { createFormModel, FormValues, FormField } from '~/components/Form';
import { DataTable, DataTableView } from '~/components/DataTable';
import SearchForm from './SearchForm.vue';
import RecordsPagination from './RecordsPagination.vue';
import { notify } from '~/lib/notifier';
import { PaginatedRecords } from '~/lib/api/mappers';

interface RecordActions {
  edit?: boolean;
}

export default Vue.extend({
  components: { SearchForm, DataTableView, RecordsPagination },
  props: {
    entity: { type: String, required: true },
    searchFields: { type: Array as PropType<FormField[]>, required: true },
    tableColumns: { type: Array as PropType<DataTable.Column[]>, required: true },
    recordActions: { type: Object as PropType<RecordActions>, default: null },
  },
  data () {
    return {
      searchValues: createFormModel(),
      searchQueryState: this.$api.newQueryState(),
    };
  },
  computed: {
    searchQueryBuilder () {
      const entityQueries = (this.$api.queries as any)[this.entity];
      const queryBuilder = entityQueries?.search || entityQueries?.index;
      if (!queryBuilder) {
        notify('error', `database.BrowsePage: search/index query is missing for entity ${this.entity}.`);
        return;
      }
      return queryBuilder;
    },
    records (): null | PaginatedRecords {
      return this.searchQueryState.value;
    },
    columnTemplates (): { [name: string]: any } {
      const templates = {} as { [name: string]: any };
      for (const column of this.tableColumns) {
        if (!column.slot) continue;
        const slot = this.$scopedSlots[column.slot];
        if (slot) templates[column.name] = slot;
      }
      return templates;
    },
  },
  watch: {
    entity () {
      this.searchQueryState.reset();
      Vue.nextTick(() => this.search());
    },
  },
  mounted () {
    this.search();
  },
  methods: {
    onSearch (value: FormValues) {
      this.searchValues = value;
      this.search();
    },
    onSelectPage (page: number) {
      this.search(page);
    },
    search (page?: number) {
      this.$api.request(
        this.searchQueryBuilder({ ...this.searchValues, page }),
        this.searchQueryState,
      );
    },
  },
});
</script>
