<template>
  <div class="col d-flex flex-column data-table">
    <header-row
      v-if="showHeaders"
      :actions-width="actionsColumnWidth"
      :columns="columns"
      :column-cell-styles="columnCellStyles"
      @sizes-changed="onHeadersChanged"
    >
      <template #cell="{ column }">
        <slot name="header-cell" :column="column" />
      </template>
    </header-row>
    <div
      v-for="row in rows"
      :key="row.index"
      class="d-flex --row"
    >
      <slot name="row-actions-cell" :item="row.item" />
      <div
        v-for="(column, index) in columns"
        :key="column.name"
        class="d-flex align-items-center justify-content-center"
        :style="columnCellStyles[index]"
      >
        <div class="overflow-hidden text-truncate --cell">
          <table-cell
            :key="index"
            :column="column"
            :row="row"
            :template="columnTemplates && columnTemplates[column.name]"
          />
        </div>
      </div>
    </div>
    <div v-if="showFooterRow" class="d-flex --row">
      <slot name="footer-row" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { TableColumn, TableRow } from './types';
import TableCell from './TableCell';
import { notify } from '~/lib/notifier';
import HeaderRow from './c/HeaderRow.vue';

export default Vue.extend({
  components: { HeaderRow, TableCell },
  props: {
    actionsColumnWidth: { type: Number, default: 0 },
    columns: { type: Array as PropType<TableColumn[]>, required: true },
    columnTemplates: { type: Object as PropType<{ [name: string]: any }>, default: undefined },
    showHeaders: { type: Boolean, default: true },
    dataset: { type: Array as PropType<any[]>, required: true },
  },
  data () {
    return {
      columnCellStyles: this.columns.map(_ => null) as Array<null | string>,
    };
  },
  computed: {
    rows (): TableRow[] {
      const validItems = this.dataset.filter(item => item?.id);
      if (validItems.length < this.dataset.length) {
        notify('error', 'DataTable: some item of given dataset are missing an id.');
      }
      return validItems.map((item, index) => ({ index, item }));
    },
    showFooterRow (): boolean {
      return !!this.$scopedSlots['footer-row'];
    },
  },
  methods: {
    onHeadersChanged (sizes: number[]): void {
      this.columnCellStyles = sizes.map(value => `width: ${value}px;`);
    },
  },
});
</script>
