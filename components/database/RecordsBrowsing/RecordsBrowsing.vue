<template>
  <div :class="[$attrs.class]">
    <browsing-actions v-if="actions" :actions="actions" />
    <div class="emb-2 d-flex justify-content-between">
      <div>
        <t value="db.record.shared.label.records_count" />
        <span>: </span>
        <span>{{ records ? records.total : 0 }}</span>
      </div>
      <browsing-pagination
        :request-state="searchQueryState"
        @select="onGotoPage"
      />
    </div>
    <data-table-view
      class="width-100"
      :columns="columns"
      :dataset="records ? records.records : []"
      :query-state="searchQueryState"
      :templates="$scopedSlots"
    >
      <template #header-cell="{ column }">
        <t :value="`db.record.${entity}.label.${column.name}`" />
      </template>
    </data-table-view>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Actions, { Action } from './Actions.vue';
import Pagination from './Pagination.vue';
import { DataTable } from '~/components/DataTable';
import { QueryDefinition } from '~/lib/api';
import * as mappers from '~/lib/api/mappers';
import { PaginatedRecords } from '~/lib/api/mappers';

@Component({
  components: {
    BrowsingActions: Actions,
    BrowsingPagination: Pagination,
  },
})
export default class RecordsBrowsing<R extends mappers.RecordBase> extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly buildQuery!: () => QueryDefinition<mappers.PaginatedRecords<R>>;
  @Prop({ required: true }) readonly searchToken!: number;
  @Prop({ required: true }) readonly columns!: DataTable.Column[];
  @Prop() readonly actions?: Action[];

  searchQueryState = this.$api.newQueryState<mappers.PaginatedRecords<R>>();

  @Watch('entity')
  onEntityChanged () {
    this.search();
  }

  mounted () {
    this.search();
  }

  get records (): null | PaginatedRecords<R> {
    return this.searchQueryState.value;
  }

  onGotoPage (page: number) {
    this.search(page);
  }

  search (page?: number) {
    const query = this.buildQuery();
    if (page) {
      query.params = { ...query.params, page };
    }

    this.$api.request(
      query,
      this.searchQueryState,
    );
  }
}
</script>
