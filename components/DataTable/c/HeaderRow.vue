<template>
  <div
    class="d-flex --row --header"
  >
    <div :style="actionsStyle" />
    <div
      v-for="(column, index) in columns"
      :key="column.name"
      :style="columnCellStyles[index]"
    >
      <slot name="cell" :column="column" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ACTIONS_COLUMN_WIDTH, TableColumn } from '..';

export default Vue.extend({
  props: {
    columns: { type: Array as PropType<TableColumn[]>, required: true },
    actionsWidth: { type: Number, default: undefined },
    columnCellStyles: { type: Array as PropType<Array<null | string>>, required: true },
  },
  computed: {
    actionsStyle (): string {
      return `width: ${this.actionsWidth || ACTIONS_COLUMN_WIDTH}px;`;
    },
  },
  mounted () {
    const columns = Array.from(this.$el.children) as HTMLDivElement[];
    const sizes = [] as number [];
    for (let index = 0; index < columns.length; index += 1) {
      const column = columns[index];
      if (column.style.width) continue;
      sizes.push(getNormalizedColumnWidth(column));
    }
    this.$emit('sizes-changed', sizes);
  },
});

const MIN_COL_WIDTH = 99;
const COL_PADDING = 12;
const MAX_COL_WIDTH = 299 + (2 * COL_PADDING);
function getNormalizedColumnWidth (column: HTMLDivElement): number {
  const renderedWidth = column.clientWidth;
  if (renderedWidth < MIN_COL_WIDTH) return MIN_COL_WIDTH;
  if (renderedWidth > MAX_COL_WIDTH) return MAX_COL_WIDTH;
  return renderedWidth + (2 * COL_PADDING);
}
</script>
