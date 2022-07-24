<template>
  <div :class="className">
    <table>
      <colgroup>
        <col style="width: 40px;">
        <col
          v-for="column of computedColumns"
          :key="column.key"
          :style="column.style"
        >
        <col>
      </colgroup>
      <thead>
        <tr>
          <th />
          <th v-for="column of computedColumns" :key="column.key" scope="col">
            <div class="three-rows-cell">
              <slot :name="column.headerSlot" />
            </div>
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) of items" :key="i">
          <td>
            <div class="single-row-cell">
              <btn-mini variant="secondary" icon="x" @click="onRemove(i)" />
            </div>
          </td>
          <td v-for="column of computedColumns" :key="column.key">
            <slot :name="column.cellSlot" :item="item" :index="i" />
          </td>
          <td />
        </tr>
        <tr>
          <td :colspan="columns.length + 2">
            <btn-mini variant="primary" icon="plus" @click="onAdd" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import classNames from 'classnames';
import { ItemsListing } from '~/components/ItemsListing';

@Component
export default class Main extends Vue {
  @Prop({ required: true }) columns!: ItemsListing.Column[];
  @Prop({ required: true }) items!: Record<string, any>[];

  columnsStatic = [ ...this.columns ];
  widths = this.columnsStatic.map(column => column.size ?? 150);

  get className (): string {
    return classNames(
      'data-table',
      this.$attrs.class,
    );
  }

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
}
</script>
