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
        :dataset="records"
        :column-templates="columnTemplates"
      >
        <template #header-cell="{ column }">
          {{ $t(`record.${entity}.${column.name}`) }}
        </template>
        <template #row-actions="{ item }">
          <b-dropdown-item
            v-if="recordActions && recordActions.show"
            :to="`/database/${entity}/${item.id}/show`"
          >
            <b-icon-card-heading variant="primary" />
            {{ $t('db.shared.show') }}
          </b-dropdown-item>
          <b-dropdown-item
            v-if="recordActions && recordActions.edit"
            :to="`/database/${entity}/${item.id}/edit`"
          >
            <b-icon-pencil variant="secondary" />
            {{ $t('db.shared.edit') }}
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
import { BIconCardHeading, BIconPencil } from 'bootstrap-vue';

interface RecordActions {
  edit?: boolean;
  show?: boolean;
}

export default Vue.extend({
  components: { SearchForm, DataTableView, BIconCardHeading, BIconPencil },
  props: {
    entity: { type: String, required: true },
    searchFields: { type: Array as PropType<FormField[]>, required: true },
    tableColumns: { type: Array as PropType<TableColumn[]>, required: true },
    recordActions: { type: Object as PropType<RecordActions>, default: null },
  },
  data () {
    return {
      records: [] as any[],
      searching: this.$api.createRequestState(),
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
      this.records = [];
      this.searching = this.$api.createRequestState();
      Vue.nextTick(() => this.search({}));
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
        this.records = result.records;
      }
    },
  },
});
</script>
