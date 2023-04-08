<template>
  <div>
    <data-table :columns="columns">
      <data-table-headers-row :columns="columns" />
      <tbody>
        <tr>
          <td />
          <td>1</td>
          <td>2</td>
          <td />
        </tr>
        <tr>
          <td />
          <td>2</td>
          <td>4</td>
          <td />
        </tr>
      </tbody>
    </data-table>
  </div>
</template>

<script lang="ts">
import { h } from 'vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { Column, DataTable, DataTableHeadersRow } from '~/components/DataTable/v3';

const entity = 'people';

function renderHeader (column) {
  return h('t', { props: { value: `db.record.${entity}.label.${column.name}` } });
}

@Component({
  components: {
    DataTable,
    DataTableHeadersRow,
  },
})
export default class extends DatabasePage {
  columns: Column[] = [
    { name: 'actions', size: 60 },
    { name: 'a', size: 60, renderHeader },
    { name: 'b', size: 250, renderHeader },
  ];
}
</script>
