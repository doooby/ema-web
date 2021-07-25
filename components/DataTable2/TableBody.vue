<template>
  <tbody>
    <tr
      v-for="dataItem of dataset"
      :key="dataItem.id"
    >
      <td
        v-for="column of columns"
        :key="column.name"
      >
        <table-cell
          :column="column"
          :data-item="dataItem"
          :template="templates[column.name]"
        />
      </td>
      <td />
    </tr>
  </tbody>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import TableCell from './TableCell';
import { DataTable } from '.';

export default Vue.extend({
  components: { TableCell },
  props: {
    columns: { type: Array as PropType<DataTable.Column[]>, required: true },
    dataset: { type: Array as PropType<any[]>, required: true },
    templates: { type: Object as PropType<{ [name: string]: any }>, default: undefined },
  },
  computed: {
  },
});
</script>
