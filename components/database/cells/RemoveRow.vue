<template>
  <div class="single-row-cell">
    <b-button variant="outline-secondary" class="btn-xs" @click="onClick">
      <b-icon icon="x" />
    </b-button>
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
