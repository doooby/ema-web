<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Column } from './types';

@Component
export default class DataTable extends Vue {
  @Prop({ required: true }) readonly columns!: Column[];

  get colStyles () {
    return this.columns.map(column => `width: ${column.size}px`);
  }
}
</script>

<template>
  <div class="ema--data-table">
    <table class="w-100">
      <colgroup>
        <col
          v-for="(column, index) in columns"
          :key="column.name"
          :style="colStyles[index]"
        >
        <col style="min-width: 12px;">
      </colgroup>
      <slot />
    </table>
  </div>
</template>

<style lang="scss">
@import "assets/css/variables";
.ema--data-table {
  overflow-x: scroll;
  background-color: $EMA-table-head;

  > table {
    table-layout: fixed;

    > tbody > tr {
      border-bottom: 1px solid $input-bg;
      &:last-child { border-bottom: none; }

      > td:not(.ema--data-table--td__empty) {
        padding: 4px 0;
        background-color: $body-bg;
      }

      &:not(.ema--data-table--tr__non_hoverable):hover > td:not(.ema--data-table--td__empty) {
        background-color: $gray-100;
      }
    }
  }
}


</style>
