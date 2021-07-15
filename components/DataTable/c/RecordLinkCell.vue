<template>
  <show-record-link :entity="column.cell.entity" :record-id="record.id">
    {{ caption }}
  </show-record-link>
</template>

<script lang="ts">
import Vue from 'vue';
import { TABLE_CELL_PROPS } from '../constants';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import { RecordLinkCellType } from '../types';

export default Vue.extend({
  components: { ShowRecordLink },
  props: TABLE_CELL_PROPS,
  computed: {
    record (): any {
      return this.row.item;
    },
    caption (): string {
      const textGet = (this.column.cell as RecordLinkCellType)!.text;
      if (textGet) return textGet(this.record);
      return this.record[this.column.name];
    },
  },
});
</script>
