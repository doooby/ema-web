<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Column, DataTableHeader } from '~/components/DataTable/v3';

@Component({
  components: { DataTableHeader },
})
export default class DataTableHeadersRow extends Vue {
  @Prop({ required: true }) readonly columns!: Column[];
}
</script>

<template>
  <thead>
    <tr>
      <data-table-header
        v-for="(column, index) in columns"
        :key="`${index}-${column.name}`"
        :column="column"
      />
      <th scope="col" />
    </tr>
  </thead>
</template>
