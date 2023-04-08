<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Column } from '~/components/DataTable/v3/types';

const HeaderContent = Vue.extend({
  functional: true,
  render (_, { props }: any): Vue.VNode {
    return props.column.renderHeader(props.column);
  },
});

@Component({
  components: { HeaderContent },
})
export default class DataTableHeader extends Vue {
  @Prop({ required: true }) readonly column!: Column;
}
</script>

<template>
  <th
    class="ema--data-table-header"
    scope="col"
  >
    <div class="mx-2 d-flex align-items-center">
      <header-content v-if="column.renderHeader" :column="column" />
      <slot v-else />
    </div>
  </th>
</template>

<style lang="scss">
.ema--data-table {
  th.ema--data-table-header {
    padding: 0;

    > div {
      min-height: 2.5em;
    }
  }
}
</style>
