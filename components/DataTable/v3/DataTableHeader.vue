<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Column } from '~/components/DataTable/v3/types';
import DataTableHeaderLimit from '~/components/DataTable/v3/DataTableHeaderLimit.vue';

const minWidth = 50;

const HeaderContent = Vue.extend({
  functional: true,
  render (_, { props }: any): Vue.VNode {
    return props.column.renderHeader(props.column);
  },
});

@Component({
  components: { HeaderContent, DataTableHeaderLimit },
})
export default class DataTableHeader extends Vue {
  @Prop({ required: true }) readonly column!: Column;

  defaultSize = this.column.size;

  onShift (value) {
    this.column.size += value;
    if (this.column.size < minWidth) this.column.size = minWidth;
  }
}
</script>

<template>
  <th
    class="ema--data-table-header"
    scope="col"
  >
    <div class="ml-4 d-flex align-items-center">
      <div class="flex-fill">
        <header-content v-if="column.renderHeader" :column="column" />
        <slot v-else />
      </div>
      <data-table-header-limit
        v-if="!column.fixedSize"
        @shift="onShift"
        @reset="column.size = defaultSize"
      />
    </div>
  </th>
</template>

<style lang="scss">
.ema--data-table {
  th.ema--data-table-header {
    padding: 0;
  }
}
</style>
