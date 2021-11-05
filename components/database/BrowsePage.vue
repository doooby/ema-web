<template>
  <div class="page-content -has-submenu">
    <div class="page-menu">
      <search-form
        :fields="searchFields"
        @search="onSearch"
      />
    </div>
    <div v-if="!isPageAllowed" class="container-fluid emy-4">
      <b-alert show variant="info">
        {{ $t('db.shared.not_admissible') }}
      </b-alert>
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
          <template v-if="actions" #actions="{ dataItem }">
            <record-actions-cell
              entity="users"
              :record="dataItem"
              :actions="actions"
            />
          </template>
        </data-table-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { FormValues, FormField } from '~/components/Form';
import { DataTable } from '~/components/DataTable';
import SearchForm from './SearchForm.vue';
import RecordsPagination from './RecordsPagination.vue';
import { PaginatedRecords } from '~/lib/api/mappers';
import RecordActionsCell, { Action as ActionItem } from '~/components/database/RecordActionsCell.vue';

@Component({
  components: { SearchForm, RecordsPagination, RecordActionsCell },
})
export default class BrowsePage extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly searchFields!: FormField[];
  @Prop({ required: true }) readonly tableColumns!: DataTable.Column[];
  @Prop({ default: () => [] }) readonly actions!: ActionItem[];

  searchValues = {};
  searchQueryState = this.$api.newQueryState();

  @Watch('entity')
  onEntityChanged () {
    this.searchQueryState.reset();
    this.updatePage();
  }

  @Watch('isPageAllowed')
  onPageAllowedChanged () {
    this.updatePage();
  }

  mounted () {
    this.updatePage();
  }

  get isPageAllowed (): boolean {
    return this.$store.getters['session/isPageAllowed'];
  }

  get searchQueryBuilder () {
    const entity = this.entity;
    const entityQueries = (this.$api.queries as any)[entity];
    const queryBuilder = entityQueries?.search || entityQueries?.index;
    if (!queryBuilder) {
      utils.notify('error', `database.BrowsePage: search/index query is missing for entity ${entity}.`);
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

  onSearch (value: FormValues) {
    this.searchValues = value;
    this.search();
  }

  onSelectPage (page: number) {
    this.search(page);
  }

  updatePage () {
    if (this.isPageAllowed) this.search();
    else this.searchQueryState.reset();
  }

  search (page?: number) {
    this.$api.request(
      this.searchQueryBuilder({ ...this.searchValues, page }),
      this.searchQueryState,
    );
  }
}
</script>
