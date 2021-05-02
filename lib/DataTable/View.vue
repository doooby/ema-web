<template>
  <div class="d-flex flex-column data-table">
    <div
      v-if="headers"
      class="d-flex --row --header"
    >
      <div
        v-for="column in columns"
        :key="column.key"
      >
        {{ column.caption }}
      </div>
    </div>
    <div
      v-for="row in rows"
      :key="row.key"
      class="d-flex --row"
    >
      <div
        v-for="(column, index) in columns"
        :key="column.key"
      >
        {{ sanitizeCellValue(column, row.values[index]) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { TableColumn, TableRow } from '.';

export default Vue.extend({
  props: {
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true,
    },
    headers: {
      type: Boolean,
    },
    rows: {
      type: Array as PropType<TableRow[]>,
      required: true,
    },
  },
  methods: {
    sanitizeCellValue (_column: TableColumn, value: any): null | string {
      return value === undefined ? null : String(value);
    },
  },
});
</script>
