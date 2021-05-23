<template>
  <div class="d-flex flex-column data-table">
    <div
      v-if="headers"
      class="d-flex --row --header"
    >
      <div />
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
      <div>
        <b-dropdown no-caret variant="link" dropright>
          <template #button-content>
            <b-icon-three-dots-vertical />
          </template>
          <b-dropdown-item
            v-if="recordEditPath"
            :to="recordEditPath(row.key)"
          >
            <b-icon-pencil class="rounded" variant="warning" />
            editace
          </b-dropdown-item>
        </b-dropdown>
      </div>
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
import { BIconThreeDotsVertical, BIconPencil } from 'bootstrap-vue';
import { TableColumn, TableRow } from '.';

export default Vue.extend({
  components: {
    BIconThreeDotsVertical,
    BIconPencil,
  },
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
    recordEditPath: {
      type: Function as PropType<null | ((id: any) => string)>,
      default: null,
    },
  },
  methods: {
    sanitizeCellValue (_column: TableColumn, value: any): null | string {
      return value === undefined ? null : String(value);
    },
  },
});
</script>
