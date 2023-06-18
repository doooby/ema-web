<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SearchRecordsPagination from '~/components/database/components/SearchRecordsPagination.vue';
import { Params, SearchRecordsResponsePayload } from '~/lib/api2';
import { Column, DataTable, DataTableHeadersRow } from '~/components/DataTable/v3';

const CellContent = Vue.extend({
  functional: true,
  render (_, { props }: any): Vue.VNode {
    return props.column.renderCell(props.record);
  },
});

@Component({
  components: {
    SearchRecordsPagination,
    DataTable,
    DataTableHeadersRow,
    CellContent,
  },
})
export default class ARecordsListing extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ required: true }) readonly columns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  currentQuery = this.$api2.newQueryState<SearchRecordsResponsePayload>()
  liveQuery = this.$api2.newQueryState<SearchRecordsResponsePayload>();

  @Watch('entity')
  @Watch('params')
  onEntityChanged () {
    this.fetchRecords();
  }

  @Watch('records')
  onRecordsChanged () {
    this.$emit('change', this.records);
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

  get allColumns () {
    return [ ...this.initialColumns, ...this.columns ];
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
      <div class="ml-1">
        <div v-if="liveQuery.processing" class="spinner-border spinner-border-sm" role="status">
          <span class="sr-only" />
        </div>
      </div>
      <search-records-pagination :request="currentQuery" @select="fetchRecords" />
    </div>
    <data-table
      class="mt-2"
      :columns="allColumns"
    >
      <data-table-headers-row :columns="allColumns" />
      <tbody v-if="showError">
        <tr>
          <td :colspan="allColumns.length + 1">
            <b-alert variant="warning" show class="m-0">
              <t value="data_table.fetch_fail" />
              <span />
              <t :value="`app.processing.${showError}`" />
            </b-alert>
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="(record, index) of records" :key="`${index}-${record.id}`">
          <td v-for="column of initialColumns" :key="column.name">
            <cell-content v-if="column.renderCell" :column="column" :record="record" />
          </td>
          <slot name="row" :record="record" />
        </tr>
      </tbody>
      <tbody v-if="$slots['footer']">
        <tr>
          <td :colspan="allColumns.length + 1">
            <slot name="footer" />
          </td>
        </tr>
      </tbody>
    </data-table>
  </div>
</template>
