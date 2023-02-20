<template>
  <div class="single-row-cell">
    <div v-if="date">
      {{ $d(date) }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';

@Component
export default class Date extends Vue {
  @Prop({ required: true }) readonly column!: DataTable.Column;
  @Prop({ required: true }) readonly dataItem!: any;

  get date (): undefined | Date {
    return this.dataItem[this.column.name];
  }
}
</script>
