<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import TableColgroup from '~/components/DataTable/TableColgroup.vue';
import TableHead from '~/components/DataTable/TableHead.vue';
import { DataTable } from '~/components/DataTable/index';

@Component({
  components: { TableColgroup, TableHead },
})
export default class View2 extends Vue {
  @Prop({ required: true }) readonly columns!: DataTable.Column[];

  localColumnWidths = this.columns.map(column => column.size ?? 150);

  onColumnResize ({ index, x, reset }) {
    const newSize = reset
      ? (this.columns[index].size ?? 150)
      : (this.localColumnWidths[index] + x);
    this.$set(this.localColumnWidths, index, newSize < 40 ? 40 : newSize);
  }
}
</script>

<template>
  <div :class="[ 'data-table', $attrs.class ]">
    <table>
      <table-colgroup
        :columns="columns"
        :widths="localColumnWidths"
      />
      <table-head
        :columns="columns"
        @resize="onColumnResize"
      >
        <template #header-cell="{ column }">
          <slot name="header-cell" :column="column" />
        </template>
      </table-head>
      <slot name="content" />
    </table>
  </div>
</template>
