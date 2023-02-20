<template>
  <div class="page-content -has-submenu">
    <div class="page-menu">
      <search-form
        :fields="searchFormFields"
        :entity="entity"
        @search="onSearch"
      />
    </div>
    <div class="container-fluid emy-4">
      <div class="row no-gutters emb-2">
        <div class="col-lg-6">
          <t value="db.record.shared.label.records_count" />
          <span>: </span>
          <t v-if="isFetching" value="app.loading" />
          <span v-else>
            {{ records ? records.total : 0 }}
          </span>
        </div>
        <div class="col-lg-6">
          <records-pagination
            :request-state="searchQueryState"
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
            <t :value="`db.record.${entity}.label.${column.name}`" />
          </template>
          <template v-if="actions.length" #cell-actions="{ dataItem }">
            <record-actions
              :entity="entity"
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
import {
  FormValues,
  buildFormFields,
  FormFieldDefinition,
  prefillFormValues,
  formToRecordParams,
} from '~/components/Form';
import { DataTable } from '~/components/DataTable';
import SearchForm from './SearchForm.vue';
import RecordsPagination from '../../RecordsBrowsing/Pagination.vue';
import { PaginatedRecords } from '~/lib/api/mappers';
import RecordActions, { Action as ActionItem } from '~/components/database/cells/RecordActions.vue';
import { SearchRecordsResponsePayload } from '~/lib/api2';
import { RequestState } from '~/lib/api';

@Component({
  components: { SearchForm, RecordsPagination, RecordActions },
})
export default class IndexPage extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly searchFields!: FormFieldDefinition[];
  @Prop({ required: true }) readonly tableColumns!: DataTable.Column[];
  @Prop({ default: () => [] }) readonly actions!: ActionItem[];

  searchFormFields = buildFormFields(this.searchFields);
  searchValues = prefillFormValues(this.searchFormFields);
  searchQueryState2 = this.$api2.newQueryState<SearchRecordsResponsePayload>();

  @Watch('entity')
  @Watch('searchFields')
  onEntityChanged () {
    this.searchFormFields = buildFormFields(this.searchFields);
    this.searchValues = prefillFormValues(this.searchFormFields);
    this.updatePage();
  }

  mounted () {
    this.updatePage();
  }

  get searchQueryBuilder () {
    const entity = this.entity;
    const queryBuilder = (this.$api2.queries as any)[entity]?.search;
    if (!queryBuilder) {
      utils.warn(`database.Index2Page: index query is missing for entity ${entity}.`);
      return;
    }
    return queryBuilder;
  }

  get searchQueryState (): RequestState {
    const response = this.searchQueryState2.response;
    if (this.isFetching || !response) {
      return {
        running: true,
        value: null,
        fail: null,
        error: null,
        reset () {},
      };
    }

    if (response.ok) {
      return {
        running: false,
        value: response.payload,
        fail: null,
        error: null,
        reset () {},
      };
    } else {
      return {
        running: false,
        value: null,
        fail: response.message,
        error: null,
        reset () {},
      };
    }
  }

  get isFetching (): boolean {
    return this.searchQueryState2.processing;
  }

  get records (): null | PaginatedRecords<any> {
    return this.searchQueryState2.response?.ok
      ? this.searchQueryState2.response.payload
      : null;
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
    this.search();
  }

  search (page?: number) {
    const params = formToRecordParams(this.searchFormFields, this.searchValues);
    this.$api2.request(
      this.searchQueryState2,
      this.searchQueryBuilder({ ...params, page }),
    );
  }
}
</script>
