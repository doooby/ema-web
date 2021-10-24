<template>
  <div class="page-content -has-submenu">
    <div class="page-menu">
      <search-form
        :fields="searchFields"
        @search="onSearch"
      />
    </div>
    <div v-if="!pageAllowed" class="container-fluid emy-4">
      nope
    </div>
    <div v-else class="container-fluid emy-4">
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { FormValues, FormField } from '~/components/Form';
import { DataTable, DataTableView } from '~/components/DataTable';
import SearchForm from './SearchForm.vue';
import RecordsPagination from './RecordsPagination.vue';
import { notify } from '~/lib/notifier';
import { PaginatedRecords } from '~/lib/api/mappers';

@Component({
  components: { SearchForm, DataTableView, RecordsPagination },
})
export default class BrowsePage extends Vue {
  @Prop({ required: true }) readonly searchFields!: FormField[];
  @Prop({ required: true }) readonly tableColumns!: DataTable.Column[];

  searchValues = {};
  searchQueryState = this.$api.newQueryState();

  mounted () {
    if (this.pageAllowed) this.search();
  }

  get entity (): string {
    return this.$store.getters['dbPage/entity'];
  }

  get pageAllowed (): boolean {
    return this.$store.getters['dbPage/allowed'];
  }

  get searchQueryBuilder () {
    const entity = this.entity;
    const entityQueries = (this.$api.queries as any)[entity];
    const queryBuilder = entityQueries?.search || entityQueries?.index;
    if (!queryBuilder) {
      notify('error', `database.BrowsePage: search/index query is missing for entity ${entity}.`);
      return;
    }
    return queryBuilder;
  }

  get records (): null | PaginatedRecords {
    return this.searchQueryState.value;
  }

  get columnTemplates (): { [name: string]: any } {
    const templates = {} as { [name: string]: any };
    for (const column of this.tableColumns) {
      if (!column.slot) continue;
      const slot = this.$scopedSlots[column.slot];
      if (slot) templates[column.name] = slot;
    }
    return templates;
  }

  @Watch('entity')
  onEntityChanged () {
    this.searchQueryState.reset();
    Vue.nextTick(() => this.search());
  }

  onSearch (value: FormValues) {
    this.searchValues = value;
    this.search();
  }

  onSelectPage (page: number) {
    this.search(page);
  }

  search (page?: number) {
    this.$api.request(
      this.searchQueryBuilder({ ...this.searchValues, page }),
      this.searchQueryState,
    );
  }
}
</script>
