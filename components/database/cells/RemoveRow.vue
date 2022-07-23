<template>
  <div class="single-row-cell">
    <btn-mini variant="secondary" icon="x" @click="onClick" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';

@Component
export default class RemoveRow extends Vue {
  @Prop({ required: true }) readonly column!: DataTable.Column;
  @Prop({ required: true }) readonly dataItem!: any;

  onClick () {
    this.column.cell?.onRemove?.(this.dataItem);
  }
}
</script>
