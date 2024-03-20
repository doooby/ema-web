<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { DataTable, DataTableColumn } from '~/components/toolkit/DataTable';
import app from '~/lib/app';
import RecordId from '~/components/views/application/RecordId.vue';
import RecordsTableControls from '~/components/views/application/RecordsTable/RecordsTableControls.vue';
import LoaderStrip from '~/components/views/application/pages/LoaderStrip.vue';

@Component({
  components: { LoaderStrip, RecordsTableControls, RecordId, DataTable },
})
export default class RecordsTable extends Vue {
  @Prop({ required: true }) readonly columns!: DataTableColumn[];
  @Prop({ required: true }) readonly resource!: app.db.Records<unknown>;
  @Prop() readonly pageState?: app.PageState;
  @Prop() readonly loadOnMount?: boolean;
  @Prop() readonly hidePerPage?: boolean;
  @Prop() readonly sortOptions?: {
    name?: string;
    options?: string[];
  };

  mounted () {
    if (this.loadOnMount) this.onChange();
  }

  get recordsOffset (): number {
    if (!this.resource.response?.ok) return 0;
    const { payload } = this.resource.response;
    return (payload.listing.page - 1) * payload.listing.per_page;
  }

  get sortOptionItems () {
    return app.db.mapSortOptions(
      this.sortOptions?.name ?? 'all',
      this.sortOptions?.options,
    );
  }

  get isLoading () {
    return !!(
      this.resource.isLoading ||
      this.pageState?.isLoading
    );
  }

  get errorMessage () {
    return (
      (this.resource.failReason ? `app.processing.${this.resource.failReason}` : undefined) ||
      this.pageState?.errorMessage
    );
  }

  @Watch('resource.queryParams.listingParams')
  @Watch('resource.queryParams.params')
  onChange () {
    this.$emit('change');
  }
}
</script>

<template>
  <div :class="$attrs.class">
    <slot name="prepend" />
    <RecordsTableControls
      :list="resource.okPayload"
      :query-params="resource.queryParams"
      :sort-options="sortOptionItems"
      :disabled="isLoading"
      :hide-per-page="hidePerPage"
    />
    <DataTable
      :columns="columns"
      class="mt-1"
    >
      <template #header-prepend>
        <LoaderStrip :is-processing="isLoading" />
      </template>
      <template #default="{ columnsCount }">
        <tbody v-if="errorMessage">
          <tr>
            <td :colspan="columnsCount">
              <div class="m-0 alert alert-warning">
                <t
                  class="d-block"
                  value="views.application.RecordsTable.fetch_fail"
                />
                <t
                  class="d-block"
                  :value="errorMessage"
                />
              </div>
            </td>
          </tr>
        </tbody>
        <slot name="prepend-records" :columns-count="columnsCount" />
        <tbody>
          <tr v-for="(record, index) in (resource.okPayload?.records ?? [])" :key="`${index}-${record.id}`">
            <td v-if="record.error" :colspan="columns.length">
              <div class="pt-2">
                <b-alert variant="warning" show class="m-0">
                  <t
                    class="d-block"
                    value="views.application.RecordsTable.record_error"
                  />
                  <RecordId :record="record" />
                </b-alert>
              </div>
            </td>
            <slot
              v-else
              name="row"
              :record="record"
              :order="recordsOffset + index"
            />
          </tr>
        </tbody>
        <slot name="append-records" :columns-count="columnsCount" />
      </template>
    </DataTable>
  </div>
</template>
