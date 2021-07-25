<template>
  <show-record-link :entity="column.cell.entity" :record-id="associatedRecord.id">
    {{ associatedRecord.label }}
  </show-record-link>
</template>

<script lang="ts">
import Vue from 'vue';
import sharedProps from './sharedProps';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';

export default Vue.extend({
  components: { ShowRecordLink },
  props: sharedProps,
  computed: {
    associatedRecord (): any {
      return this.dataItem[this.column.name];
    },
  },
});
</script>
