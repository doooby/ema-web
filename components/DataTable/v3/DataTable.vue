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
  background-color: $input-bg;

  > table {
    table-layout: fixed;

    tbody > tr {
      border-bottom: 1px solid $input-bg;
      &:last-child { border-bottom: none; }

      &:hover {
        background-color: $gray-200;
      }

      > td {
        padding: 4px 0;
        background-color: $body-bg;
      }
    }
  }
}
</style>
