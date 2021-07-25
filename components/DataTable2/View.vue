<template>
  <div :class="className">
    <table>
      <table-colgroup
        :columns="columns"
        :widths="localColumnWidths"
      />
      <table-head
        :columns="columns"
      >
        <template #header-cell="{ column }">
          <slot name="header-cell" :column="column" />
        </template>
      </table-head>
      <table-body
        :columns="columns"
        :dataset="computedDataSet"
        :templates="computedCellTemplates"
      />
    </table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import classNames from 'classnames';
import { DataTable } from '.';
import TableColgroup from './TableColgroup';
import TableHead from './TableHead';
import TableBody from './TableBody';
import { notify } from '~/lib/notifier';

export default Vue.extend({
  components: { TableColgroup, TableHead, TableBody },
  props: {
    columns: { type: Array as PropType<DataTable.Column[]>, required: true },
    templates: { type: Object as PropType<{ [name: string]: any }>, default: undefined },
    dataset: { type: Array as PropType<any[]>, required: true },
  },
  data () {
    return {
      localColumnWidths: this.columns.map(column => column.size),
    };
  },
  computed: {
    className () {
      return classNames(
        'data-table2',
        this.$attrs.class,
      );
    },
    computedDataSet (): any[] {
      const validItems = this.dataset.filter(item => item?.id);
      if (validItems.length < this.dataset.length) {
        notify('error', 'DataTable: some item of given dataset are missing an id.');
      }
      return validItems;
    },
    computedCellTemplates (): { [name: string]: any } {
      const templates = { ...this.templates };
      for (const column of this.columns) {
        const slot = column.slot && this.$scopedSlots[column.slot];
        if (slot) templates[column.name] = slot;
      }
      return templates;
    },
  },
});
</script>
