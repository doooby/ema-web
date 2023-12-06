<script lang="ts">
import { h } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SelectPage, { PER_PAGE } from '~/components/database/components/listing/SelectPage.vue';
import { Params, SearchRecordsResponsePayload } from '~/lib/api2';
import { Column, DataTable, DataTableHeadersRow } from '~/components/DataTable/v3';
import ActionsCell from './ActionsCell.vue';
import ListingControlsRow, {
  ListingControls,
} from '~/components/database/components/listing/ARecordsListing/ListingControlsRow.vue';

export interface Model {
  controls: ListingControls;
  records: unknown[];
  selected: unknown[];
  isAllSelected: boolean;
  toggleSelectAll(): void;
}

const CellContent = Vue.extend({
  functional: true,
  render (_, { props }: any): Vue.VNode {
    return props.column.renderCell(props.record);
  },
});

@Component({
  components: {
    ListingControlsRow,
    SelectPage,
    DataTable,
    DataTableHeadersRow,
    CellContent,
  },
})
export default class ARecordsListing extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  // TODO remove
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ required: true }) readonly columns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;
  @Prop() readonly staticPerPage?: number;
  @Prop({ default: () => 36 }) readonly actionsSize!: number;
  @Prop() readonly isProcessing?: boolean;
  @Prop() readonly defaultSort?: [string, string][];

  liveQuery = this.$api2.newQueryState<SearchRecordsResponsePayload>();
  stableQuery = this.$api2.newQueryState<SearchRecordsResponsePayload>();

  model: Model = {
    controls: {
      pagination: { page: 1, perPage: PER_PAGE[0] },
      sort: this.defaultSort?.[0] ?? [ 'id', 'desc' ],
    },
    records: [],
    selected: [],
    isAllSelected: false,
    toggleSelectAll: () => {
      if (this.model.isAllSelected) {
        this.model.selected = [];
        this.model.isAllSelected = false;
      } else {
        this.model.selected = [ ...this.model.records ];
        if (this.model.records.length) this.model.isAllSelected = true;
      }
    },
  };

  @Watch('records')
  onRecordsChanged () {
    this.model.records = this.records;
    this.model.selected = [];
    this.model.isAllSelected = false;
    this.$emit('load', this.model.records);
  }

  mounted () {
    this.$emit('connect', this.model);
    this.fetchRecords();
  }

  get showError (): null | string {
    if (!this.stableQuery.response || this.stableQuery.response.ok) {
      return null;
    } else {
      return this.stableQuery.response.message;
    }
  }

  get allColumns () {
    const groupActions = this.$scopedSlots['group-actions'];
    const recordActions = this.$scopedSlots['record-actions'];

    return [
      {
        name: 'row_index',
        size: 30,
        fixedSize: true,
      },
      {
        name: 'actions',
        size: this.actionsSize,
        fixedSize: true,
        renderCell: (record: unknown) => h(
          ActionsCell,
          {
            props: {
              selectable: !!groupActions,
              selected: this.model.selected.includes(record),
            },
            on: {
              select: () => this.changeRecordSelection(record),
            },
            scopedSlots: {
              actions: recordActions
                ? () => recordActions?.({ record })
                : undefined,
            },
          },
        ),
      },
      ...this.initialColumns,
      ...this.columns,
    ];
  }

  get isLoading (): boolean {
    return this.isProcessing || this.liveQuery.processing;
  }

  get records (): unknown[] {
    return this.stableQuery.response?.ok
      ? this.stableQuery.response.payload.records
      : [];
  }

  @Watch('entity')
  @Watch('params')
  @Watch('model.controls')
  async fetchRecords () {
    if (this.liveQuery.processing) return;

    const country_id = this.$store.getters['session/countryId'];
    await this.$api2.request(
      this.liveQuery,
      this.$api2.getQuery(this.entity, 'search')({
        ...this.params,
        country_id,
        page: this.model.controls.pagination.page,
        per_page: this.staticPerPage ?? this.model.controls.pagination.perPage,
        sort: [ this.model.controls.sort ],
      }),
    );
    this.stableQuery.response = this.liveQuery.response;
  }

  changeRecordSelection (record: unknown): void {
    const index = this.model.selected.indexOf(record);
    if (index !== -1) {
      this.model.selected.splice(index, 1);
    } else {
      this.model.selected.push(record);
    }
    this.model.isAllSelected = this.model.selected.length >= this.model.records.length;
  }
}
</script>

<template>
  <div :class="$attrs.class">

    <div
      v-if="$scopedSlots['group-actions']"
      class="d-flex align-items-center"
    >
      <b-button
        variant="outline-secondary"
        size="xs"
        :disabled="isLoading"
        @click="model.toggleSelectAll()"
      >
        <b-icon :icon="model.isAllSelected ? 'x' : 'check-all'" />
      </b-button>
      <div class="ml-3">
        <b-dropdown
          :disabled="!model.selected.length"
          toggle-class="py-0"
        >
          <template #button-content>
            <t value="db.listing.selection.count" />
            ({{ model.selected.length }})
          </template>
          <slot name="group-actions" :records="model.selected" />
        </b-dropdown>
      </div>
    </div>

    <ListingControlsRow
      v-model="model.controls"
      class="mt-3"
      :entity="entity"
      :request="stableQuery"
      :hide-per-page="!!staticPerPage"
      :disabled="isLoading"
    />

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
      <tbody v-if="$slots['prepend-body']">
        <slot name="prepend-body" />
      </tbody>
      <tbody>
        <tr v-for="(record, index) of records" :key="`${index}-${record.id}`">
          <td>
            <h6 class="text-muted text-center m-0">
              {{ index + 1 }}.
            </h6>
          </td>
          <td>
            <cell-content :column="allColumns[1]" :record="record" />
          </td>
          <td v-for="column of initialColumns" :key="column.name">
            <cell-content v-if="column.renderCell" :column="column" :record="record" />
          </td>
          <slot name="row" :record="record" />
        </tr>
      </tbody>
      <tbody v-if="$slots['footer']">
        <tr>
          <td :colspan="allColumns.length + 1" class="p-0">
            <slot name="footer" />
          </td>
        </tr>
      </tbody>
    </data-table>
  </div>
</template>
