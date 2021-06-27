<template>
  <div class="d-flex flex-column data-table">
    <header-row
      v-if="showHeaders"
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
      <div :style="actionsColumnCellStyles">
        <b-dropdown no-caret variant="link" dropright>
          <template #button-content>
            <b-icon-three-dots-vertical />
          </template>
          <slot name="row-actions" :item="row.item" />
        </b-dropdown>
      </div>
      <div
        v-for="(column, index) in columns"
        :key="column.name"
        class="d-flex align-items-center justify-content-center"
        :style="columnCellStyles[index]"
      >
        <div class="overflow-hidden --cell">
          <table-cell
            :key="index"
            :column="column"
            :row="row"
            :template="columnTemplates && columnTemplates[column.name]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BIconThreeDotsVertical } from 'bootstrap-vue';
import { TableColumn, TableRow } from './types';
import { ACTIONS_COLUMN_WIDTH } from './constants';
import TableCell from './TableCell';
import { notify } from '~/lib/notifier';
import HeaderRow from './c/HeaderRow.vue';

export default Vue.extend({
  components: { HeaderRow, TableCell, BIconThreeDotsVertical },
  props: {
    columns: { type: Array as PropType<TableColumn[]>, required: true },
    columnTemplates: { type: Object as PropType<{ [name: string]: any }>, default: undefined },
    showHeaders: { type: Boolean, default: true },
    dataset: { type: Array as PropType<any[]>, required: true },
  },
  data () {
    return {
      actionsColumnCellStyles: cellStyle(ACTIONS_COLUMN_WIDTH),
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
  },
  methods: {
    onHeadersChanged (sizes: number[]): void {
      this.columnCellStyles = sizes.map(value => cellStyle(value));
    },
  },
});

function cellStyle (columnSize: number): string {
  return `width: ${columnSize}px;`;
}
</script>
