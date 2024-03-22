<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { DataTableColumn } from '~/components/toolkit/DataTable/types';
import { flatten } from 'lodash';
import { h } from 'vue';
import Translation from '~/components/toolkit/Translation.vue';
import DataTableHeaderLimit from '~/components/DataTable/v3/DataTableHeaderLimit.vue';
import app from '~/lib/app';

const MIN_COLUMNS_WIDTH = 100;

const HeaderContent = Vue.extend({
  functional: true,
  render (_, { props }: any): Vue.VNode {
    const column = props.column as DataTableColumn;
    if (column.header) {
      return column.header(column);
    } else if (column.headerText) {
      return DataTable.renderTextualHeader(column.headerText);
    } else {
      return h('div', {});
    }
  },
});

@Component({
  components: { HeaderContent, DataTableHeaderLimit },
})
export default class DataTable extends Vue {
  @Prop({ required: true }) readonly columns!: DataTableColumn[];
  @Prop() readonly hideHeader?: boolean;
  @Prop() readonly noAdditionColumns?: boolean;

  defaultSizes = this.columns.map(({ size, fixedSize }) => {
    return fixedSize && size ? size : resizeColumn(size);
  });

  currentSizes = this.defaultSizes.slice(0);

  static flattenColumns (
    ...args: (DataTableColumn | DataTableColumn[])[]
  ): DataTableColumn[] {
    return flatten(args).filter(a => a) as DataTableColumn[];
  }

  static fixedColumn (
    name: string,
    size?: number,
  ): DataTableColumn {
    return { name, size, fixedSize: true };
  }

  static renderTextualHeader (text) {
    return h(Translation, {
      props: { value: text },
      class: 'text-break',
    });
  }

  @Watch('columns')
  onColumnsChange () {
    this.defaultSizes = this.columns.map(({ size, fixedSize }) => {
      return fixedSize && size ? size : resizeColumn(size);
    });
    this.currentSizes = this.defaultSizes.slice(0);
  }

  get colStyles () {
    return this.currentSizes.map(size => size && `width: ${size}px`);
  }

  get columnsCount () {
    if (this.noAdditionColumns) return this.columns.length;
    else return this.columns.length + 1;
  }

  onShift (columnIndex: number, value: number) {
    Vue.set(
      this.currentSizes,
      columnIndex,
      resizeColumn(this.currentSizes[columnIndex], value),
    );
  }
}

function resizeColumn (
  size: app.Maybe<number>,
  diff?: number,
) {
  let value: app.Maybe<number>;
  if (diff) {
    value = (size ?? 0) + diff;
  } else if (size) {
    value = size;
    if (value < MIN_COLUMNS_WIDTH) value = MIN_COLUMNS_WIDTH;
  }
  return value;
}
</script>

<template>
  <div
    :class="[
      'ema--toolkit--data-table',
      $attrs.class,
    ]"
  >
    <table class="w-100">
      <colgroup>
        <col
          v-for="(column, index) in columns"
          :key="column.name"
          :style="colStyles[index]"
        >
        <col v-if="!noAdditionColumns" style="min-width: 12px;">
      </colgroup>
      <thead v-if="!hideHeader">
        <tr v-if="$slots['header-prepend']">
          <th
            class="ema--toolkit--data-table--header__prepend"
            :colspan="columnsCount"
          >
            <slot name="header-prepend" />
          </th>
        </tr>
        <tr>
          <th
            v-for="(column, index) of columns"
            :key="index"
            class="ema--toolkit--data-table--header"
            scope="col"
          >
            <div class="d-flex align-items-center">
              <div class="flex-fill px-2">
                <HeaderContent :column="column" />
              </div>
              <DataTableHeaderLimit
                v-if="!column.fixedSize"
                @shift="onShift(index, $event)"
                @reset="column.size = defaultSizes[index]"
              />
            </div>
          </th>
          <th scope="col" />
        </tr>
      </thead>
      <slot :columns-count="columnsCount" />
    </table>
  </div>
</template>

<style lang="scss">
@import "assets/css/variables";
.ema--toolkit--data-table {
  overflow-x: scroll;
  background-color: $EMA-table-bg;

  > table {
    table-layout: fixed;

    > thead > tr {
      > th.ema--toolkit--data-table--header {
        padding: 0;
        > div {
          //overflow-y: auto;
          max-height: 100px;
        }
      }
      > th.ema--toolkit--data-table--header__prepend {
        background-color: $body-bg;
        padding: 0;
      }
    }

    > tbody > tr {
      border-bottom: 1px solid $input-bg;

      > td:not(.ema--toolkit--data-table--td__empty) {
        padding: 12px 0;
        background-color: $body-bg;
      }

      &:not(.ema--toolkit--data-table--tr__non_hoverable):hover > td:not(.ema--toolkit--data-table--td__empty) {
        background-color: $gray-100;
      }

      &:not(.ema--toolkit--data-table--tr__border_bottom):last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
