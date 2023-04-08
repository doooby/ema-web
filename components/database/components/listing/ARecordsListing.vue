<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SearchPagination from '~/components/database/components/listing/SearchPagination.vue';
import { Params, SearchRecordsResponsePayload } from '~/lib/api2';
import { DataTable } from '~/components/DataTable';

@Component({
  components: { SearchPagination },
})
export default class ARecordsListing extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ default: () => {} }) readonly params!: Params;
  @Prop({ required: true }) readonly tableColumns!: DataTable.Column[];

  currentQuery = this.$api2.newQueryState<SearchRecordsResponsePayload>()
  liveQuery = this.$api2.newQueryState<SearchRecordsResponsePayload>();

  @Watch('entity')
  @Watch('params')
  onEntityChanged () {
    this.fetchRecords();
  }

  @Watch('records')
  onRecordsChanged () {
    this.$emit('list', this.records);
  }

  mounted () {
    this.fetchRecords();
  }

  get showError (): null | string {
    if (!this.currentQuery.response || this.currentQuery.response.ok) {
      return null;
    } else {
      return this.currentQuery.response.message;
    }
  }

  get records (): never[] {
    return this.currentQuery.response?.ok
      ? this.currentQuery.response.payload.records
      : [];
  }

  async fetchRecords (page?: number) {
    if (this.liveQuery.processing) return;

    const country_id = this.$store.getters['session/countryId'];
    await this.$api2.request(
      this.liveQuery,
      this.$api2.getQuery(this.entity, 'search')({
        ...this.params,
        country_id,
        page,
      }),
    );
    this.currentQuery.response = this.liveQuery.response;
  }
}
</script>

<template>
  <div :class="$attrs.class">
    <div class="d-flex justify-content-between">
      <div>
        <div v-if="liveQuery.processing" class="spinner-border spinner-border-sm" role="status">
          <span class="sr-only" />
        </div>
      </div>
      <search-pagination :query="currentQuery" @select="fetchRecords" />
    </div>
    <data-table2-view
      class="mt-2"
      :columns="tableColumns"
    >
      <template #header-cell="{ column }">
        <slot v-if="$scopedSlots[`col-h-${column.name}`]" :name="`col-h-${column.name}`" />
        <t v-else :value="`db.record.${entity}.label.${column.name}`" />
      </template>
      <template #content>
        <tbody v-if="showError">
          <tr>
            <td :colspan="tableColumns.length + 1">
              <b-alert variant="warning" show class="m-0">
                <t value="data_table.fetch_fail" />
                <span />
                <t :value="`app.processing.${showError}`" />
              </b-alert>
            </td>
          </tr>
        </tbody>
        <tbody v-if="records">
          <slot name="body" :records="records" />
        </tbody>
        <tbody v-if="$slots['footer-cell']">
          <tr>
            <td :colspan="tableColumns.length + 1">
              <slot name="footer-cell" />
            </td>
          </tr>
        </tbody>
      </template>
    </data-table2-view>
  </div>
</template>
