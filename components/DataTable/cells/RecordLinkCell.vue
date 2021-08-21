<template>
  <div class="single-row-cell">
    <code v-if="column.cell.onlyId">
      [{{ dataItem.id }}]
    </code>
    <show-record-link
      v-else
      :entity="column.cell.entity"
      :record-id="dataItem.id"
    >
      {{ caption }}
    </show-record-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import sharedProps from './sharedProps';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';

export default Vue.extend({
  components: { ShowRecordLink },
  props: sharedProps,
  computed: {
    caption (): string {
      const textGet = this.column.cell!.text;
      if (textGet) return safeGetText(textGet, this.dataItem);
      return this.dataItem[this.column.name];
    },
  },
});

function safeGetText (getText: any, dataItem: any): any {
  try {
    return getText?.(dataItem);
  } catch (err) {
    utils.notify('error', err, { 'DataTable.cells.RecordLinkCell': 'getText failed' });
    return null;
  }
}
</script>
