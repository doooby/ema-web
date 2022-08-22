<template>
  <thead>
    <tr>
      <th
        v-for="(column, index) of columns"
        :key="column.name"
        scope="col"
      >
        <div class="three-rows-cell">
          <span v-if="typeof column.headerText === 'function'">
            {{ column.headerText() }}
          </span>
          <slot
            v-else-if="column.headerText !== false"
            name="header-cell"
            :column="column"
          />
        </div>
        <column-limit
          @shift="$emit('resize', { index, x: $event })"
          @reset="$emit('resize', { index, reset: true })"
        />
      </th>
      <th scope="col" />
    </tr>
  </thead>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTable } from './index';
import ColumnLimit from '~/components/DataTable/ColumnLimit.vue';

export default Vue.extend({
  components: { ColumnLimit },
  props: {
    columns: { type: Array as PropType<DataTable.Column[]>, required: true },
  },
});
</script>
