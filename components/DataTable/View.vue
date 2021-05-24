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
          <slot name="row-actions" :item="row.item" />
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
import { BIconThreeDotsVertical } from 'bootstrap-vue';
import { TableColumn, TableRow } from '.';
import { notify } from '~/lib/notifier';

export default Vue.extend({
  components: {
    BIconThreeDotsVertical,
  },
  props: {
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true,
    },
    headers: {
      type: Boolean,
    },
    dataset: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  computed: {
    rows (): TableRow[] {
      const validItems = this.dataset.filter(item => item?.id);
      if (validItems.length < this.dataset.length) {
        notify('error', 'DataTable: some item of given dataset are missing an id.');
      }

      const columns = this.columns;
      return validItems.map(item => ({
        key: String(item.id),
        item,
        values: columns.map(column => this.sanitizeCellValue(column, item[column.key])),
      }));
    },
  },
  methods: {
    sanitizeCellValue (_column: TableColumn, value: any): null | string {
      return value === undefined ? null : String(value);
    },
  },
});
</script>
