<template>
  <show-record-link :entity="column.cell.entity" :record-id="associatedRecord.id">
    {{ associatedRecord.label }}
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
    associatedRecord (): any {
      return this.row.item[this.column.name];
    },
  },
});
</script>
