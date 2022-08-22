<template>
  <colgroup>
    <col
      v-for="(column, index) of columns"
      :key="column.name"
      :style="styles[index]"
    >
    <col style="min-width: 25px;">
  </colgroup>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTable } from '.';

export default Vue.extend({
  props: {
    columns: { type: Array as PropType<DataTable.Column[]>, required: true },
    widths: { type: Array as PropType<number[]>, required: true },
  },
  computed: {
    styles (): string[] {
      return this.columns.map((_, i) => `width: ${this.widths[i]}px`);
    },
  },
});
</script>
