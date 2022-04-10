<template>
  <thead>
    <tr>
      <th
        v-for="column of columns"
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
      </th>
      <th scope="col" />
    </tr>
  </thead>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTable } from './index';

export default Vue.extend({
  props: {
    columns: { type: Array as PropType<DataTable.Column[]>, required: true },
  },
});
</script>
