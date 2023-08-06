<script lang="ts">
import { h } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SelectPage from '~/components/database/components/listing/SelectPage.vue';
import { Params, SearchRecordsResponsePayload } from '~/lib/api2';
import { Column, DataTable, DataTableHeadersRow } from '~/components/DataTable/v3';
import ActionsCell from './ARecordsListing/ActionsCell.vue';

export interface Model {
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

  liveQuery = this.$api2.newQueryState<SearchRecordsResponsePayload>();
  stableQuery = this.$api2.newQueryState<SearchRecordsResponsePayload>();

  model: Model = {
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

  @Watch('entity')
  @Watch('params')
  onEntityChanged () {
    this.fetchRecords();
  }

  @Watch('records')
  onRecordsChanged () {
    this.model.records = this.records;
    this.model.selected = [];
    this.model.isAllSelected = false;
  }

  mounted () {
    this.$emit('connect', this.model);
    this.fetchRecords();
    console.log(Object.keys(this.$scopedSlots));
  }

  get showError (): null | string {
    if (!this.stableQuery.response || this.stableQuery.response.ok) {
      return null;
    } else {
      return this.stableQuery.response.message;
    }
  }

  get allColumns () {
    return [
      {
        name: 'actions',
        size: 36,
        fixedSize: true,
        renderCell: (record: unknown) => h(
          ActionsCell,
          {
            props: {
              selectable: !!this.$scopedSlots['group-actions'],
              selected: this.model.selected.includes(record),
            },
            on: {
              select: () => this.changeRecordSelection(record),
            },
            scopedSlots: {
              actions: this.$scopedSlots['record-actions']
                ? () => this.$scopedSlots['record-actions']?.({ record })
                : undefined,
            },
          },
        ),
      },
      ...this.initialColumns,
      ...this.columns,
    ];
  }

  get records (): unknown[] {
    return this.stableQuery.response?.ok
      ? this.stableQuery.response.payload.records
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
    <div class="d-flex justify-content-between position-relative">
      <div
        v-if="liveQuery.processing"
        class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
      >
        <div class="spinner-border spinner-border-sm" role="status">
          <span class="sr-only" />
        </div>
      </div>
      <div class="d-flex align-items-center pl-2">
        <b-button
          v-if="$scopedSlots['group-actions']"
          variant="outline-secondary"
          size="xs"
          @click="model.toggleSelectAll()"
        >
          <b-icon :icon="model.isAllSelected ? 'x' : 'check-all'" />
        </b-button>
        <div
          v-if="$scopedSlots['group-actions']"
          class="ml-2"
        >
          <b-dropdown
            :disabled="!model.selected.length"
            size="sm"
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
      <select-page :request="stableQuery" @select="fetchRecords" />
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
          <td>
            <cell-content :column="allColumns[0]" :record="record" />
          </td>
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
