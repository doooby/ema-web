<template>
  <div :class="[$attrs.class, 'data-table']">
    <table>
      <colgroup>
        <col style="width: 40px;">
        <col
          v-for="column of computedColumns"
          :key="column.key"
          :style="column.style"
        >
        <col style="min-width: 25px;">
      </colgroup>
      <thead>
        <tr>
          <th />
          <th v-for="(column, index) of computedColumns" :key="column.key" scope="col">
            <div class="three-rows-cell">
              <slot :name="column.headerSlot" />
            </div>
            <column-limit
              @shift="onColumnResize({ index, x: $event })"
              @reset="onColumnResize({ index, reset: true })"
            />
          </th>
          <th scope="col" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) of items" :key="i">
          <td>
            <div class="single-row-cell d-flex justify-content-center align-items-center epy-2">
              <btn-mini variant="secondary" icon="x" @click="onRemove(i)" />
            </div>
          </td>
          <td v-for="column of computedColumns" :key="column.key">
            <slot :name="column.cellSlot" :item="item" :index="i" />
          </td>
          <td />
        </tr>
        <tr>
          <td>
            <div class="single-row-cell d-flex justify-content-center align-items-center epy-2">
              <btn-mini variant="primary" icon="plus" @click="onAdd" />
            </div>
          </td>
          <td :colspan="columns.length + 1" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ItemsListing } from '~/components/ItemsListing';
import ColumnLimit from '~/components/DataTable/ColumnLimit.vue';

@Component({
  components: { ColumnLimit },
})
export default class Main extends Vue {
  @Prop({ required: true }) columns!: ItemsListing.Column[];
  @Prop({ required: true }) items!: Record<string, any>[];

  columnsStatic = [ ...this.columns ];
  widths = this.columnsStatic.map(column => column.size ?? 150);

  get computedColumns (): ItemsListing.ComputedColumn[] {
    return this.columnsStatic.map((column, i) => ({
      key: i,
      style: `width: ${this.widths[i]}px`,
      headerSlot: `header-${column.name}`,
      cellSlot: `cell-${column.name}`,
    }));
  }

  onRemove (index: number) {
    const newItems = [ ...this.items ];
    newItems.splice(index, 1);
    this.$emit('change', newItems);
  }

  onAdd () {
    this.$emit('add');
  }

  onColumnResize ({ index, x, reset }) {
    const newSize = reset
      ? (this.columns[index].size ?? 150)
      : (this.widths[index] + x);
    this.$set(this.widths, index, newSize < 25 ? 25 : newSize);
  }
}
</script>
