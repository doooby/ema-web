<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { DataTable, DataTableColumn } from '~/components/toolkit/DataTable';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import RecordId from '~/components/views/application/RecordId.vue';
import RecordsTableControls from '~/components/views/application/RecordsTable/RecordsTableControls.vue';

@Component({
  components: { RecordsTableControls, RecordId, DataTable },
})
export default class RecordsTable extends Vue {
  @Prop({ required: true }) readonly columns!: DataTableColumn[];
  @Prop({ required: true }) readonly resource!: app.db.Resource<wai.RecordsList<unknown>>;
  @Prop() readonly sortOptions?: {
    name?: string;
    options?: string[];
  };

  get records (): wai.AResource<unknown>[] {
    if (!this.resource.response?.ok) return [];
    const { payload } = this.resource.response;
    return payload.records;
  }

  get failReason () {
    if (!this.resource.response || this.resource.response.ok) return;
    return this.resource.response.reason;
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

  get recordsList (): app.Maybe<wai.RecordsList<unknown>> {
    return this.resource.response?.ok ? this.resource.response.payload : undefined;
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
      :list="recordsList"
      :query-params="resource.queryParams"
      :sort-options="sortOptionItems"
      :disabled="resource.isLoading"
    />
    <DataTable
      :columns="columns"
      class="mt-1"
    >
      <template v-if="failReason" #prepend-full-row>
        <b-alert variant="warning" show class="m-0">
          <t
            class="d-block"
            value="views.application.RecordsTable.fetch_fail"
          />
          <t
            class="d-block"
            :value="`app.processing.${failReason}`"
          />
        </b-alert>
      </template>
      <tbody>
        <tr v-for="(record, index) in records" :key="`${index}-${record.id}`">
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
    </DataTable>
  </div>
</template>
