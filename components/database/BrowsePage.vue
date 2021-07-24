<template>
  <div class="page-content -has-submenu">
    <div class="page-menu">
      <search-form
        :value="searchValues"
        :fields="compiledSearchFields"
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
          :actions-column-width="50"
          :columns="compiledTableColumns"
          :dataset="records ? records.records : []"
          :column-templates="columnTemplates"
        >
          <template #header-cell="{ column }">
            {{ $t(`record.${entity}.${column.name}`) }}
          </template>
          <template
            v-if="recordActions && recordActions.edit"
            #row-actions-cell="{ item }"
          >
            <div style="width: 50px;">
              <b-dropdown no-caret variant="link" dropright>
                <template #button-content>
                  <b-icon-three-dots-vertical />
                </template>
                <b-dropdown-item
                  v-if="recordActions && recordActions.edit"
                  :to="`/database/${entity}/${item.id}/edit`"
                >
                  <b-icon-pencil variant="secondary" />
                  {{ $t('db.shared.edit') }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </template>
        </data-table-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { FormField, defineFormFields, createFormModel, FormValues } from '~/components/Form';
import { TableColumn, defineTableColumns, View as DataTableView } from '~/components/DataTable';
import SearchForm from './SearchForm.vue';
import RecordsPagination from './RecordsPagination.vue';
import { notify } from '~/lib/notifier';
import { BIconPencil, BIconThreeDotsVertical } from 'bootstrap-vue';
import { PaginatedRecords } from '~/lib/api/mappers';

interface RecordActions {
  edit?: boolean;
}

export default Vue.extend({
  components: { SearchForm, DataTableView, BIconPencil, BIconThreeDotsVertical, RecordsPagination },
  props: {
    entity: { type: String, required: true },
    searchFields: { type: Array as PropType<FormField[]>, required: true },
    tableColumns: { type: Array as PropType<TableColumn[]>, required: true },
    recordActions: { type: Object as PropType<RecordActions>, default: null },
  },
  data () {
    return {
      records: null as null | PaginatedRecords<any>,
      searching: this.$api.createRequestState(),
      searchValues: createFormModel(),
    };
  },
  computed: {
    compiledSearchFields (): Readonly<FormField[]> {
      return defineFormFields(this.searchFields);
    },
    compiledTableColumns (): Readonly<TableColumn[]> {
      return defineTableColumns(this.tableColumns);
    },
    columnTemplates (): { [name: string]: any } {
      const templates = {} as { [name: string]: any };
      for (const column of this.compiledTableColumns) {
        if (!column.slot) continue;
        const slot = this.$scopedSlots[column.slot];
        if (slot) templates[column.name] = slot;
      }
      return templates;
    },
  },
  watch: {
    entity () {
      this.records = null;
      this.searching = this.$api.createRequestState();
      Vue.nextTick(() => this.search());
    },
  },
  mounted () {
    this.search();
  },
  methods: {
    async search (page = 1) {
      if (this.searching.running) return;
      const query = (this.$api.queries as any)[this.entity]?.search;
      if (!query) {
        notify('error', `database.BrowsePage: search query is missing for entity ${this.entity}.`);
        return;
      }
      const result: any = await this.$api.query(this.searching, query, {
        ...this.searchValues,
        page,
      });
      if (result !== null) {
        this.records = result;
      }
    },
    onSearch (value: FormValues) {
      this.searchValues = value;
      this.search();
    },
    onSelectPage (page: number) {
      this.search(page);
    },
  },
});
</script>
