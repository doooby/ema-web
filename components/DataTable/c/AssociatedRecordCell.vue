<template>
  <show-record-link :entity="column.cell.entity" :record-id="associatedItem.id">
    {{ caption }}
  </show-record-link>
</template>

<script lang="ts">
import Vue from 'vue';
import { TABLE_CELL_PROPS } from '../constants';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';

export default Vue.extend({
  components: { ShowRecordLink },
  props: TABLE_CELL_PROPS,
  computed: {
    associatedItem (): any {
      return this.row.item[this.column.name];
    },
    caption (): string {
      const textGet = this.column.cell!.text;
      if (textGet) return textGet(this.associatedItem);
      return this.associatedItem.name;
    },
  },
});
</script>
