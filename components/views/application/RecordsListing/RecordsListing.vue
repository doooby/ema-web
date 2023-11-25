<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ListingControls from '~/components/views/application/RecordsListing/ListingControls.vue';
import app from '~/lib/app';
import { Column, DataTable, DataTableHeadersRow } from '~/components/DataTable/v3';
import { AResource } from '~/vendor/wai/mappers';

const CellContent = Vue.extend({
  functional: true,
  render (_, { props }: any): Vue.VNode {
    return props.column.renderCell(props.record);
  },
});

@Component({
  components: {
    DataTable,
    DataTableHeadersRow,
    ListingControls,
    CellContent,
  },
})
export default class RecordsListing<R = unknown> extends Vue {
  @Prop({ required: true }) readonly columns!: Column[];
  @Prop({ required: true }) readonly resource!: app.api.Resource<app.api.ResourcesListing<R>>;
  @Prop() readonly hidePerPage?: boolean;
  @Prop() readonly orderByOptions?: app.OptionItem<string>[];
  @Prop() readonly showRecordMenu?: boolean;
  @Prop({ default: () => 36 }) readonly rowHeaderWidth!: number;

  get allColumns (): Column[] {
    const array = [ this.rowHeaderColumn, ...this.columns ];
    return array.filter(id => id) as Column[];
  }

  get rowHeaderColumn (): undefined | Column {
    if (!this.showRecordMenu) return;
    return {
      name: 'row_header',
      size: this.rowHeaderWidth,
      fixedSize: true,
    };
  }

  get failReason (): null | string {
    if (this.resource.state.isLoading || !this.resource.state.failReason) {
      return null;
    } else {
      return this.resource.state.failReason;
    }
  }

  get records (): AResource<R>[] {
    return this.resource.state.resource?.records ?? [];
  }

  onListingChange (value: app.api.ListingParams) {
    this.resource.setListingParams(value);
    this.$emit('listingChange');
  }
}
</script>

<template>
  <div :class="$attrs.class">
    <ListingControls
      :resource="resource"
      :hide-per-page="hidePerPage"
      :order-by-options="orderByOptions"
      @input="onListingChange"
    />

    <data-table
      class="mt-2"
      :columns="allColumns"
    >
      <data-table-headers-row :columns="allColumns" />
      <tbody v-if="failReason">
        <tr>
          <td :colspan="allColumns.length">
            <b-alert variant="warning" show class="m-0">
              <t value="data_table.fetch_fail" />
              <span />
              <t :value="`app.processing.${failReason}`" />
            </b-alert>
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="(record, index) of records" :key="`${index}-${record.id}`">
          <td v-if="record.error" :colspan="allColumns.length">
            <div class="pt-2">
              <b-alert variant="warning" show class="m-0">
                <t value="data_table.record_parse_fail" />
                <span />
                <span v-if="record.id">[ {{ record.id }} ]</span>
              </b-alert>
            </div>
          </td>
          <slot v-else name="row" :record="record" />
        </tr>
      </tbody>
    </data-table>
  </div>
</template>
